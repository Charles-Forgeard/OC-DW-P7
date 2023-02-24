const argon2 = require('argon2')
const logger = require('../logger/console-dev')

/**
 * Accept a password as unique argument and return the ashed password.
 * You can verify if a password matches his hashed version but not obtain the password from his hashed version.
 *
 * @param   {String}  dataToHash  password to hash
 *
 * @return  {Promise<String>}  return hashed password
 */
exports.hash = (dataToHash) => {
  const hashedData = argon2.hash(dataToHash, {
    type: argon2.argon2i,
    memoryCost: 2 ** 16,
    hashLength: 50,
    timecost: 10,
    parallelism: 4,
  })
  logger.debug(
    { dataToHash: dataToHash, hashedData: hashedData },
    'ARGON2 VERIFY'
  )
  return hashedData
}

/**
 * Accpet a password (as second argument) to test if it matches with a hash password (in first argument)
 *
 * @param   {String}  hashedPassword
 * @param   {String}  password
 *
 * @return  {Promise<Boolean>} return true if hashedPassword matches with password, false if it doesn't.
 */
exports.verify = (hashedPassword, password) => {
  logger.debug(`${hashedPassword}, ${password}`, 'ARGON2 VERIFY')
  return argon2.verify(hashedPassword, password)
}
