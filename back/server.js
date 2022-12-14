const logger = require('../logger/console-dev')();
const { createServer } = require("http");
const app = require('./app')

const httpServer = createServer(app);

const { Server } = require("socket.io")
const auth = require('./middleware/auth')
const {writeFile, deleteFile} = require('./writeFile/writeFile')
const dataBase = require('../dataBase/dataBase')

const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session)

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif'
};

const io = new Server(httpServer, {
    path: "/socket/",
    maxHttpBufferSize: 5e8
});

const messageHandlers = require('./socketHandlers/messageHandlers.js');
const userHandlers = require('./socketHandlers/userHandlers');

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.of("/socket/").use(wrap(
    session({
        secret: '!a(M>c3@cKlEPf23sl7^][R]<>6Eol3GwZz{%Y&{-duj)VN7sV!a|9A;EJeQ',
        resave: false,
        saveUninitialized: false,
        store: new SQLiteStore({
            dir: './dataBase',
            db: 'db.sqlite'
        })
    })
))

io.of("/socket/").use(wrap(auth.is_active))

io.of("/socket/").use((socket, next)=>{
    if(socket.request.auth === 'rejected'){
        logger.warn(`socket.id = ${socket.id}`, 'SOCKET REJECTED')
        socket.emit('rejected', 'ping')
        socket.disconnect()
        next()  
    }else{
        next()
    }
})

async function list_sockets (){
    let socketInstances = await io.fetchSockets();
    socketInstances = socketInstances.map(socket => socket.id)
    logger.info("All sockets instances = " + JSON.stringify(socketInstances), 'SOCKET', 'server.js')
}

io.of("/socket/").adapter.on("join-room", async (room, id) => {
    const socket = await io.of("/socket/").in(id).fetchSockets();
    const user = socket[0].request.session?.user
    if(room === id){
        logger.info(`connection to socket ${id}`,'SOCKET')
    }else{
        io.of("/socket/").to(room).except(id).emit('attendees', {mouvement: 'join', id: id, name: user.name, firstname: user.firstname})
        logger.info(`socket ${id} has joined room ${room}`,'SOCKET')
    }
    
});


io.of("/socket/").adapter.on("leave-room", (room, id) => {

    if(room === id){
        logger.info(`disconnection from socket ${id}`, 'SOCKET DISCONNECT')
    }else{
        io.of("/socket/").to(room).except(id).emit('attendees', {mouvement: 'leave', id: id})
        logger.info(`socket ${id} has leaved room ${room}`, 'SOCKET LEAVE ROOM')
    }

});

io.of("/socket/").on("connection", async (socket) => {
    //const token = socket.handshake.headers.authorization.split(' ')[1]
    const sockets = await io.of("/socket/").fetchSockets();
    logger.info(`sockets: [${sockets.map(socket=>socket.id)}]`, 'SOCKET LIST')
    const user = socket.request.session.user;

    if(!user){
        logger.warn(user, 'SOCKET USER')
        logger.warn(socket.request.session,'SOCKET SESSION:')
        socket.request.session.destroy(err=>{
            if(err){logger.error(err, "SOCKET ECHEC SESSION.DESTROY")}
            
        })
        socket.emit('rejected', 'ping')
        socket.disconnect()
    }else{

        socket.emit('user_def',{
            id: user.id,
            name: user.name, 
            firstname: user.firstname, 
            is_admin: user.is_admin, 
            profile_picture_url: user.profile_picture_url ?? 'img/person.svg'
        })

        socket.on("disconnect", reason=>{
            logger.warn(reason, "DISCONNECT")
        })

        socket.on('rejected', ()=>{
            const sid = socket.request.session.id
            socket.request.session.destroy(err=>{
                err ? logger.error(err, "ECHEC SESSION.DESTROY") : dataBase.delete_in_sessions_control({sid: sid})
            })
        })

        socket.join('main room')
        
        messageHandlers(io,socket)
        userHandlers(io,socket)
    }

});

httpServer.on('listening', ()=>{
    logger.info('listening on port 3000','HTTPSERVER');
})

httpServer.listen(3000);