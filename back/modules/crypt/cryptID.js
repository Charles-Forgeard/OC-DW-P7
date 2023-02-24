const {
  createCipheriv,
  createDecipheriv,
  //getCiphers,
  randomBytes,
} = require('crypto')
const logger = require('../logger/console-dev')

//Log une clé de 256 bits, nécessaire au bon foctionnement de cet algorithme  de chiffrement
exports.newKey = () =>
  console.log(
    `\x1b[35mNew 256 bits key:\x1b[0m`,
    randomBytes(32).toString('hex')
  )

//Log la liste des algorithmes supportés
//logger.debug(getCiphers())

const algorithm = 'aes-256-ecb'

exports.cipher = (key, data) => {
  logger.debug({ key: key, data: data })
  return new Promise((resolve, reject) => {
    try {
      const keyBuffer = Buffer.from(key, 'hex')

      // Initialiser l'objet de chiffrement avec l'algorithme AES-256-ECB
      const cipher = createCipheriv(algorithm, keyBuffer, null)

      // Encoder le message en utilisant la méthode "update"
      let encryptedMessage = cipher.update(data, 'utf8', 'hex')

      // Finaliser l'encodage en utilisant la méthode "final"
      encryptedMessage += cipher.final('hex')

      resolve(encryptedMessage)
    } catch (err) {
      reject(new Error(err))
    }
  })
}

exports.decipher = (key, encryptedData) => {
  logger.debug({ key: key, encryptedData: encryptedData })
  return new Promise((resolve, reject) => {
    try {
      const keyBuffer = Buffer.from(key, 'hex')
      // The IV is usually passed along with the ciphertext.
      // Initialiser l'objet de déchiffrement avec l'algorithme AES-256-ECB
      const decipher = createDecipheriv(algorithm, keyBuffer, null)

      // Déchiffrer le message encodé en utilisant la méthode "update"
      let decryptedData = decipher.update(encryptedData, 'hex', 'utf8')

      // Finaliser le déchiffrement en utilisant la méthode "final"
      decryptedData += decipher.final('utf8')
      resolve(decryptedData)
    } catch (err) {
      reject(new Error(err))
    }
  })
}
