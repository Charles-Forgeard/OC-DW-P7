const logger = require('../../logger/console-dev')();
const jwt = require('../crypt/generate-verify-jwt')
const dataBase = require('../../dataBase/dataBase')
const config = require('../../config');
const argon2 = require('../crypt/generate-verify-hash')


exports.createUser = (req, res, next) => {
    logger.info(req.body, 'REQUETE BODY')
    let cryptEmail;
    (()=>{
        if(config.crypt.passwordInDB){
            return argon2.hash(req.body.password)
        }else{
            return Promise.resolve(req.body.password)
        }
    })()
    .then(password => {

        if(config.crypt.emailInDB){
            cryptEmail = jwt.create(
                `${req.body.email}`,
                config.crypt.emailInDB
                //no expiration time
            )
        }
        
        const user = {
            email: cryptEmail ? cryptEmail : req.body.email,
            password: password
        }
        if(!user.name) user.name = req.body.email.split('@')[0]
        if(!user.profile_picture_url) user.profile_picture_url = 'default_url_avatar_picture'
        return dataBase.insertUser(user)    
    })
    .then(()=>{
        dataBase.getUser({email: cryptEmail ? cryptEmail : req.body.email}).then(user => {
            logger.info(user, "INITIALIZED USER")
        })
        
        res.status(201).json({message: "Nouvel utilisateur initialisé"})
    })
    .catch(err => {
        logger.error("Echec initialisation nouvel utilisateur", 'TITRE')
        logger.error(err, "CONTENU") 
        res.status(500).json({message: 'Echec initialisation nouvel utilisateur'})
    })
}

/*
argon2.hash('!$*?MakotoYukimura%£', {
    type: argon2.argon2i,
    memoryCost: 2 ** 16,
    hashLength: 50,
    timecost: 10,
    parallelism: 4
}).then(hash=>console.log(hash))

console.log(jwt.create(
    'admin.reseau.social@groupomania.com',
    config.crypt.emailInDB
))
*/


// argon2.hash('exempledepassword', {
//     type: argon2.argon2i,
//     memoryCost: 2 ** 16,
//     hashLength: 50,
//     timecost: 10,
//     parallelism: 4
// }).then(hash=>console.log(hash))

// console.log(jwt.create(
//     'charlesforgeard@groupomania.com',
//     config.crypt.emailInDB
// ))

// argon2.hash('exempledepassword', {
//     type: argon2.argon2i,
//     memoryCost: 2 ** 16,
//     hashLength: 50,
//     timecost: 10,
//     parallelism: 4
// }).then(hash=>console.log('NEW HASH', hash))

// console.log('NEW CRYPTEMAIL',jwt.create(
//     'mariedebie@groupomania.com',
//     config.crypt.emailInDB
// ))
