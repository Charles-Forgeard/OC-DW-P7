const express = require('express');
const app = express();
const path = require('path');
const dataBase = require('../dataBase/dataBase.js');
const config = require('../config');
const logger = require('../logger/console-dev')();
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session)

const authRoute = require('./routes/auth');
const chatRoute = require('./routes/chat');

app.use(express.json())

app.use(session({
    secret: '!a(M>c3@cKlEPf23sl7^][R]<>6Eol3GwZz{%Y&{-duj)VN7sV!a|9A;EJeQ',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({
        dir: './dataBase',
        db: 'db'
    })
}))

app.get('/', (req, res)=>{
    logger.info(config.accessControlByAdmin,'ACCESS_CONTROL_BY_ADMIN')
    config.accessControlByAdmin ?
    res.status(200).sendFile(path.join(__dirname, '..', '/front/login.html')) : 
    res.status(200).sendFile(path.join(__dirname, '..', '/front/login-register.html'))
})
app.use('/', express.static(path.join(__dirname, '..','/front')))
app.use('/static/js/', express.static(path.join(__dirname, '..', '/front')))

app.use('/auth', authRoute);

app.use('/chat/img/', express.static(path.join(__dirname, '..','/front/img')));
// app.use('/chat/img/icons', express.static(path.join(__dirname, '..','/img/icons')));
app.use('/chat', chatRoute);

// app.use('/socket', socketRoute)

// node_modules\bootstrap\dist\css\bootstrap-grid.min.css

//app.use('/node_modules/socket.io/client-dist/socket.io.js', express.static(path.join(__dirname, 'node_modules/socket.io/client-dist/socket.io.js')));

//dataBase.getAllUsers().then(items => console.log(users)).catch(err => console.error(err));

// dataBase.getAllPostImages(2).then(img => console.log(img)).catch(err => console.error(err));

// dataBase.getUser(1).then(user => console.log(user)).catch(err => console.error(err));

// dataBase.getPost(1).then(post => console.log(post)).catch(err => console.error(err));

// const user = {
//     email: 'emaildetest2@gmail.com',
//     profile_picture_url: 'url_de_test.jpg',
//     password: 'password_de_test',
//     name: 'nom_de_test',
//     firstname: 'prénom_de_test',
//     position: 'position_de_test',
// }

// dataBase.insertUser(user).then(result => console.log(result)).catch(err => console.error(err));



// dataBase.deleteUser(4).then(result => console.log(result)).catch(err => console.error(err));

// const post = {
//     text_content: 6,
//     created_by: 1
// }

// dataBase.insertPost(post)
//     .then(()=>{dataBase.getAllPosts().then(posts=>console.log(posts))})
//     .catch(err=>console.log(err))

// dataBase.getAllPosts().then(posts => console.log(posts)).catch(err => console.error(err));

// const user_to_update = {
//     id: 5
// }

// dataBase.update(user_to_update,'user')
//     .then(result=>console.log(result))
//     .then(()=>{return dataBase.getUser(5)})
//     .then(user=>console.log(user))
//     .then(()=>{dataBase.getUser(1).then(user=>console.log(user))})
//     .catch(err => console.error(err));

// dataBase.updateUser(user_update)

// dataBase.getAllUsers().then(users=>console.log(users))

// const user_req_search = {
//     email: 'mariedebie@gmail.com'
// }

// dataBase.getUser(user_req_search).then(user=>logger.info(user))

module.exports = app;