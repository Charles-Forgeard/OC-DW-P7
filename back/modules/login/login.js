const config = require('../../config')
const { cipher } = require('../crypt/cryptID')
const dataBase = require('../../dataBase/dataBase')
const argon2 = require('../crypt/generate-verify-hash')
const logger = require('../logger/console-dev')

module.exports = async ({ email, password, sessionUser }) => {
  logger.debug({ email: email, password: password, sessionUser: sessionUser })
  try {
    email = config.crypt.emailInDB
      ? await cipher(config.crypt.emailInDB, email)
      : email

    const user = sessionUser ?? (await dataBase.getUser({ email: email }))

    if (!user) return { user: undefined, isPasswordMatching: undefined }

    const isPasswordMatching = config.crypt.passwordInDB
      ? await argon2.verify(user.password, password)
      : password === user.password

    logger.debug(isPasswordMatching, `LOGIN module isPasswordMatching:`)
    return { user: user, isPasswordMatching: isPasswordMatching }
  } catch (error) {
    return { error: error }
  }
}
