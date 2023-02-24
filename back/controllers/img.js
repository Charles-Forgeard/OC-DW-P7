const path = require('path')
const fs = require('fs')
const logger = require('../modules/logger/console-dev')

const MIME_TYPES = {
  jpg: 'image/jpg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  svg: 'image/svg+xml',
}

exports.getImage = (req, res, next) => {
  logger.debug(req.params[0])
  const filePath = path.join(__dirname, '../private/', req.params[0])
  logger.debug(filePath)
  const file = fs.createReadStream(filePath)
  file.on('open', () => {
    const mimeType = MIME_TYPES[req.params[0].split('.').pop()]
    res.set('Content-Type', mimeType)
    file.pipe(res)
    res.status(200)
  })
  file.on('error', (err) => {
    logger.error(
      `Echec de la création du readStream sur le fichier ${filePath}`,
      'TITLE'
    )
    logger.error(err, 'CONTENT')
    res.set('Content-Type', 'text/plain')
    res.status(404).end('Not found')
  })
}
