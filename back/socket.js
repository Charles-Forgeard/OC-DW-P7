const { Server } = require('socket.io')
const logger = require('./modules/logger/console-dev')
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session)
const auth = require('./middlewares/auth')
const dataBase = require('./dataBase/dataBase')
const { host, AccessControlAllowOrigin } = require('./config')

exports.socketIo = (httpServer) => {
  const io = new Server(httpServer, {
    path: '/socket/',
    maxHttpBufferSize: 3e6,
    cors: {
      origin: AccessControlAllowOrigin ?? `${host}`,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  io.of('/socket/').adapter.on('join-room', async (room, id) => {
    const socket = await io.of('/socket/').in(id).fetchSockets()
    const user = socket[0].request.session?.user
    if (room === id) {
      logger.info(`connection to socket ${id}`, 'SOCKET')
    } else {
      io.of('/socket/').to(room).except(id).emit('attendees', {
        mouvement: 'join',
        id: id,
        name: user.name,
        firstname: user.firstname,
      })
      logger.info(`socket ${id} has joined room ${room}`, 'SOCKET')
    }
  })

  io.of('/socket/').adapter.on('leave-room', (room, id) => {
    if (room === id) {
      logger.info(`disconnection from socket ${id}`, 'SOCKET DISCONNECT')
    } else {
      io.of('/socket/')
        .to(room)
        .except(id)
        .emit('attendees', { mouvement: 'leave', id: id })
      logger.info(`socket ${id} has leaved room ${room}`, 'SOCKET LEAVE ROOM')
    }
  })

  const messageHandlers = require('./socketHandlers/messageHandlers.js')
  const userHandlers = require('./socketHandlers/userHandlers')

  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next)

  io.of('/socket/').use(
    wrap(
      session({
        secret: '!a(M>c3@cKlEPf23sl7^][R]<>6Eol3GwZz{%Y&{-duj)VN7sV!a|9A;EJeQ',
        resave: false,
        saveUninitialized: false,
        store: new SQLiteStore({
          dir: './dataBase',
          db: 'db.sqlite',
        }),
      })
    )
  )

  logger.info(
    ` using path: ${io.opts.path} , allow origin: ${io.opts.cors.origin}`,
    '',
    'New socket.io instance intialized: '
  )

  io.of('/socket/').use(wrap(auth.is_active))

  io.of('/socket/').use((socket, next) => {
    if (socket.request.auth === 'rejected') {
      logger.warn(`socket.id = ${socket.id}`, 'SOCKET REJECTED')
      socket.emit('rejected', 'ping')
      socket.disconnect()
      next()
    } else {
      next()
    }
  })

  io.of('/socket/').on('connection', async (socket) => {
    //const token = socket.handshake.headers.authorization.split(' ')[1]
    const sockets = await io.of('/socket/').fetchSockets()
    logger.info(
      `sockets: [${sockets.map((socket) => socket.id)}]`,
      'SOCKET LIST'
    )

    const user = socket.request.session.user

    if (!user) {
      logger.warn(user, 'SOCKET USER')
      logger.warn(socket.request.session, 'SOCKET SESSION:')
      socket.request.session.destroy((err) => {
        if (err) {
          logger.error(err, 'SOCKET ECHEC SESSION.DESTROY')
        }
      })
      socket.emit('user_def', undefined)
      socket.disconnect()
    } else {
      socket.emit('user_def', {
        id: user.id,
        name: user.name,
        firstname: user.firstname,
        is_admin: user.is_admin,
        profile_picture_url: user.profile_picture_url ?? 'img/person.svg',
      })

      const sessionTouch = () => {
        logger.debug('session.touch()', 'SOCKET session.touch()')
        socket.request.session.reload((err) => {
          if (err) {
            logger.warn(err, 'SOCKET session.touch()')
            socket.emit('rejected', 'Invalid session')
            dataBase.delete_sid_uid({ sid: socket.request.session.id })
            return socket.disconnect()
          }
          socket.request.session.cookie.expires = new Date(Date.now() + 45000)
          socket.request.session.user.socketID = socket.id
          socket.request.session.save()
        })
      }

      sessionTouch()

      socket.on('disconnect', (reason) => {
        logger.warn(reason, 'DISCONNECT')
      })

      socket.on('rejected', () => {
        const sid = socket.request.session.id
        try {
          dataBase
            .delete_session({ sid: sid })
            .then(() => dataBase.delete_sid_uid({ sid: sid }))
        } catch (err) {
          logger.error(err)
        }
      })

      socket.conn.on('packet', (packet) => {
        if (packet.type !== 'pong') {
          logger.info(
            `user.id: ${user.id}, session.id: ${
              socket.request.session.id
            }, packet: ${JSON.stringify(packet)}`,
            'SOCKET packet'
          )
        }

        if (packet.type === 'pong') {
          sessionTouch()
        }
      })

      socket.join('main room')

      messageHandlers(io, socket)
      userHandlers(io, socket)
    }
  })
}
