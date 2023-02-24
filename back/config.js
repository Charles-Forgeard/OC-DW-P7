require('dotenv').config()

const logger = require('./modules/logger/console-dev')

//CF .env.example file
exports.env = process.env.NODE_ENV

let apiPort, frontPort, host

logger.info(`ENV: ${process.env.NODE_ENV}`)

if (process.env.NODE_ENV === 'development') {
  apiPort = 3000
  frontPort = 3001
  host = 'http://localhost'
} else {
  apiPort = 8080
  frontPort = 80
  host = 'http://groupomania.now-dns.org'
}

exports.apiPort = apiPort
exports.frontPort = frontPort
exports.host = host

//Domaine du site faisant appel à l'API. Tout autre domaine est rejeté par l'API.
//groupomania.now-dns.org
exports.AccessControlAllowOrigin = `http://localhost:${this.frontPort}`
// exports.AccessControlAllowOrigin = `http://groupomania.now-dns.org`

exports.accessControlByAdmin =
  process.env.ACCESS_CONTROL_BY_ADMIN === 'true' ? true : false

//CF .env.example file
exports.crypt = {
  emailInDB: process.env.CRYPT_EMAIL,
  passwordInDB: true,
}
