const tinify = require('tinify')
const config = require('../../config')
const logger = require('../logger/console-dev')

tinify.key = config.tinypngApiKey

exports.optimise = (buffer, size = 300) =>
  new Promise(async (resolve, reject) => {
    const optimized = await tinify
      .fromBuffer(buffer)
      .resize({
        method: 'fit',
        width: size,
        height: size,
      })
      .convert({
        type: '*/*',
      })
    const extension = await optimized.result().extension()

    optimized.toBuffer((err, buffer) => {
      if (err) return reject(err)
      resolve({ buffer: buffer, extension: extension })
    })
  })

exports.isEnabled = !!config.tinypngApiKey
