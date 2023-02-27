const logger = require('../modules/logger/console-dev')
const dataBase = require('../dataBase/dataBase')
const config = require('../config')
const argon2 = require('../modules/crypt/generate-verify-hash')
const { writeFile, deleteFile } = require('../modules/writeFile/writeFile')
const { cipher } = require('../modules/crypt/cryptID')
const login = require('../modules/login/login')

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

function formatUrlPicture(customFile, timeStamp) {
  const fileName = customFile.name.split('.').slice(0, -1).join('.')
  const typeMime = MIME_TYPES[customFile.type]
  const completeFileName = `${fileName}${timeStamp}.${typeMime}`
  return `img/users/${completeFileName}`
}

module.exports = (io, socket) => {
  const sessionUser = socket.request.session.user

  const loginUser = async ({ email, password }) => {
    logger.warn({ email: email, password: password })
    try {
      const {
        user: loggedUser,
        isPasswordMatching,
        error,
      } = await login({
        email: email,
        password: password,
        sessionUser: sessionUser,
      })
      if (error) throw error
      if (!loggedUser || !isPasswordMatching) {
        return socket.emit('user:secondLogin', false)
      }
      socket.emit('user:secondLogin', true)
    } catch (err) {
      logger.error(err, 'SOCKET.on secondLogin')
      socket.emit('user:secondLogin', false)
    }
  }

  const updateUser = async ({
    toUpdate: {
      name,
      firstname,
      //email is sent only when admin wish update a user or admin account
      email,
      newEmail,
      newPassword,
      profile_picture,
    },
  }) => {
    logger.info(
      `{name: ${name}, firstname: ${firstname}, email: ${email}, newPassword: ${newPassword}, profile_picture: ${profile_picture}}`,
      'SOCKET ON user:update'
    )
    try {
      if (email && !sessionUser.is_admin) throw new Error('Forbidden action')
      let inactivateAccount = false

      newPassword =
        newPassword && config.crypt.passwordInDB
          ? await argon2.hash(newPassword)
          : newPassword
      newEmail =
        newEmail && config.crypt.emailInDB
          ? await cipher(config.crypt.emailInDB, email)
          : newEmail

      let userToUpdate = {}

      if (!email) {
        userToUpdate = { ...sessionUser }
      } else if (config.crypt.emailInDB && email) {
        userToUpdate.email = await cipher(config.crypt.emailInDB, email)
      } else {
        userToUpdate.email = email
      }

      if (
        userToUpdate.email !== sessionUser.email &&
        config.accessControlByAdmin
      ) {
        inactivateAccount = true
      }

      const timeStamp = Date.now()

      const promises = []
      if (profile_picture) {
        if (sessionUser.profile_picture_url !== 'default_url_avatar_picture') {
          promises.push(
            deleteFile(`private/${sessionUser.profile_picture_url}`)
          )
        }
        promises.push(
          writeFile(
            `private/${formatUrlPicture(profile_picture, timeStamp)}`,
            profile_picture.buffer
          )
        )
      }

      const allUpdates = {
        id: userToUpdate.id,
        name: name,
        firstname: firstname,
        email: newEmail ?? userToUpdate.email,
        password: newPassword,
        profile_picture_url: profile_picture
          ? formatUrlPicture(profile_picture, timeStamp)
          : null,
        is_active: inactivateAccount ? 0 : 1,
      }

      promises.push(dataBase.update(allUpdates, 'user'))

      await Promise.all(promises)

      logger.info('success', 'SOCKET ON user:update')
      socket.emit('user:update', { status: 204 })

      for (const property in allUpdates) {
        if (
          allUpdates[property] === null ||
          allUpdates[property] === undefined ||
          allUpdates[property] === ''
        )
          delete allUpdates[property]
      }

      if (allUpdates.profile_picture_url === null) {
        allUpdates.profile_picture_url = sessionUser.profile_picture_url
      }

      const userUpdated = { ...sessionUser, ...allUpdates }

      logger.info(userUpdated)

      socket.request.session.reload((err) => {
        if (err) {
          return socket.disconnect()
        }
        socket.request.session.user = userUpdated
        socket.request.session.save()
      })

      const safeUserInfo = { ...userUpdated }
      delete safeUserInfo.password
      delete safeUserInfo.is_active
      delete safeUserInfo.email

      socket.emit('user_def', safeUserInfo)
    } catch (err) {
      if (err.message === 'user unknown' || err.message === 'bad password') {
        logger.warn(err, 'SOCKET login for update user account')
        socket.emit('user:update', {
          status: 401,
          errMessage: 'Action non autorisée.',
        })
      } else {
        logger.error(err, 'SOCKET ON user:update')
        socket.emit('user:update', {
          status: 500,
          errMessage:
            "La requete a rencontré une erreur inattendue. Si l'erreur se reproduit, merci de contacter l'administrateur",
        })
      }
    }
  }

  socket.on('user:update', updateUser)
  socket.on('user:secondLogin', loginUser)
}
