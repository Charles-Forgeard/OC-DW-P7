const logger = require('../modules/logger/console-dev')
const handleError = require('../modules/error/handleApiError')
const { cipher } = require('../modules/crypt/cryptID')
const dataBase = require('../dataBase/dataBase')
const config = require('../config')
const argon2 = require('../modules/crypt/generate-verify-hash')
const login = require('../modules/login/login')

exports.isActive = (req, res) => {
  if (req.session.user.is_active) {
    res.status(200).json({ message: 'User account is active' })
  } else {
    res.status(200).json({ message: 'password update required' })
  }
}

exports.login = async (req, res, next) => {
  logger.info(req.body, 'AUTH.LOGIN => REQ.LOGIN')

  try {
    const {
      user: user_in_DB,
      isPasswordMatching,
      error,
    } = await login({
      email: req.body.email,
      password: req.body.password,
    })

    if (error) throw error

    if (!user_in_DB) throw new Error('User unknown')

    if (!isPasswordMatching) throw new Error('Bad password')

    if (!user_in_DB.is_active)
      return res.status(200).json({ message: 'User account is not active' })

    try {
      await dataBase.add_sid_uid({
        sid: req.session.id,
        uid: user_in_DB.id,
      })
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        const sid_uid = await dataBase.get_sid_uid({ uid: user_in_DB.id })
        await dataBase.delete_sid_uid({ sid: sid_uid.sid })
        await dataBase.delete_session({ sid: sid_uid.sid })
        await dataBase.add_sid_uid({
          sid: req.session.id,
          uid: user_in_DB.id,
        })
      } else {
        throw err
      }
    }

    req.session.user = user_in_DB

    next()
  } catch (err) {
    handleError(err, 'AUTH.login', res)
  }
}

exports.activeUserAccount = async (req, res) => {
  try {
    const {
      user: loggedUser,
      isPasswordMatching,
      error,
    } = await login({
      email: req.body.email,
      password: req.body.password,
    })
    if (error) throw error
    if (!loggedUser) throw new Error('User unknown')
    if (!isPasswordMatching) throw new Error('Bad password')
    if (loggedUser.is_active) throw new Error('User is already active')
    if (req.body.password === req.body.newPassword)
      throw new Error('Same password')
    const newPassword = config.crypt.passwordInDB
      ? await argon2.hash(req.body.newPassword)
      : req.body.newPassword
    const newUserData = {
      id: loggedUser.id,
      password: newPassword,
      is_active: 1,
    }
    await dataBase.update(newUserData, 'user')
    res.status(200).json({ message: 'User account actived' })
  } catch (err) {
    let errorWithStack
    if (err.code?.indexOf('SQLITE') !== -1 && err.code) {
      errorWithStack = new Error(err.message)
    }
    handleError(errorWithStack ?? err, 'AUTH.active_user_account', res)
  }
}

exports.createUser = async (req, res) => {
  logger.info(req.body, 'REQUETE BODY')
  try {
    logger.debug(config.accessControlByAdmin)
    logger.debug(!req.session?.user?.is_admin)
    if (config.accessControlByAdmin && !req.session?.user?.is_admin)
      throw new Error('User is not admin')
    if (!config.accessControlByAdmin && req.session?.user?.is_admin)
      throw new Error('Create user by Admin is not allowed')
    const password = config.crypt.passwordInDB
      ? await argon2.hash(req.body.password)
      : req.body.password
    const email = config.crypt.emailInDB
      ? await cipher(config.crypt.emailInDB, req.body.email)
      : req.body.email
    const newUser = {
      email: email,
      password: password,
      is_active: config.accessControlByAdmin ? 0 : 1,
      name: req.body.email.split('@')[0],
      profile_picture_url: 'default_url_avatar_picture',
    }
    await dataBase.insertUser(newUser)
    res.status(201).json({ message: 'Nouvel utilisateur créé' })
  } catch (err) {
    let errorWithStack
    if (err.code?.indexOf('SQLITE') !== -1 && err.code) {
      errorWithStack = new Error(err.message)
    }
    handleError(errorWithStack ?? err, 'AUTH.active_user_account', res)
  }
}
