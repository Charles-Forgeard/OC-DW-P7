const logger = require('./modules/logger/console-dev')
const { createServer } = require('http')
const app = require('./app')
const { socketIo } = require('./socket')
const config = require('./config')

const httpServer = createServer(app)

socketIo(httpServer)

httpServer.on('listening', () => {
  logger.info(
    `listening on port ${config.apiPort}`,
    'HTTPSERVER',
    undefined,
    this
  )
})

httpServer.listen(config.apiPort)
// httpServer.listen(3000, 0.0.0.0)
