const { writeFile, unlink, existsSync, mkdirSync } = require('fs')
const logger = require('../logger/console-dev')
const path = require('path')

exports.writeFile = (url, file) => {
  const dir = url.split('/').slice(0, -1).join('/')
  logger.warn(`dir: ${dir}`)
  if (!existsSync(path.join(__dirname, '../../', dir))) {
    mkdirSync(path.join(__dirname, '../../', dir))
  }
  return new Promise((resolve, reject) => {
    writeFile(url, file, (err) => {
      if (err) {
        return reject(new Error(err))
      } else {
        logger.info(url + ' recorded successfully', 'WRITEFILE')
        return resolve(url)
      }
    })
  })
}

exports.deleteFile = (url) => {
  return new Promise((resolve, reject) => {
    unlink(url, (err) => {
      if (err) {
        return reject(new Error(err))
      } else {
        logger.info(url + ' delete successfully', 'DELETEFILE')
        return resolve(url)
      }
    })
  })
}
