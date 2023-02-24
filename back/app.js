const express = require('express')
const app = express()
const dataBase = require('./dataBase/dataBase.js')
const config = require('./config')
const logger = require('./modules/logger/console-dev')
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session)
const helmet = require('helmet')

const authRoute = require('./routes/auth')
const chatRoute = require('./routes/chat')
const imgRoute = require('./routes/img')

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
)

app.use((req, res, next) => {
  logger.info(
    `${req.headers.referer} IP= ${req.ip} => ${req.headers.host}${req.path} ${req.method}`,
    'REQUETE'
  )
  res.setHeader(
    'Access-Control-Allow-Origin',
    config.AccessControlAllowOrigin ?? `${config.host}`
  )
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, Set-Cookies, Cookie'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  )
  next()
})

app.use(
  session({
    secret: '!a(M>c3@cKlEPf23sl7^][R]<>6Eol3GwZz{%Y&{-duj)VN7sV!a|9A;EJeQ',
    resave: false,
    //will be not stored in session store if session is not modified
    saveUninitialized: false,
    store: new SQLiteStore({
      dir: './dataBase',
      db: 'db.sqlite',
    }),
  })
)

setInterval(() => {
  dataBase.clear_sessions()
}, 10000)

app.use(express.json())

app.use('/auth', authRoute)
app.use('/chat', chatRoute)
app.use('/private', imgRoute)

module.exports = app
