const logger = require('../../logger/console-dev')();
const jwt = require('../crypt/generate-verify-jwt')
const mdpGenerator = require('../crypt/generate-password');
const dataBase = require('../../dataBase/dataBase')
const config = require('../../config');
const argon2 = require('../crypt/generate-verify-hash');
const email = require('../email/elasticEmail')


exports.mdpToken = mdpGenerator.mdpToken;

exports.isAdmin = (req, res, next) => {
    if(req.session.isAdmin){
        next()
    }else{
        res.status(403).json({message: 'Forbidden request'})
    }
}

exports.isActive = (req, res)=>{
        if(req.session.user.is_active){
            res.status(200).json({message: 'User account is active'})
        }else{
            res.status(200).json({message: 'password update required'})
        }
}

exports.login = (req, res, next)=>{
    logger.info(req.body, 'AUTH.LOGIN => REQ.LOGIN')
    const user_email = config.crypt.emailInDB ? jwt.create(`${req.body.email}`,config.crypt.emailInDB) : req.body.email
    const user_password = req.body.password
    dataBase.getUser({email: user_email})
        .catch(err=>{
            if(err === null){
                logger.warn(`user unknown in DB: ${req.body.email}`)
                res.status(401).json({message: 'access denied'})
            }else{
                logger.error('Internal error dataBase.getUser', 'TITRE')
                logger.error(err, 'CONTENU')
                res.status(500).json({message: 'Internal error'})
            }
        })
        .then(user_in_DB=>{
            if(!user_in_DB){
                logger.warn(`user unknown in DB: ${req.body.email}`)
                return res.status(401).json({message: 'access denied'})
            }
            if(config.crypt.passwordInDB){
                return argon2.verify(user_in_DB.password, user_password)
                        .then(matches=>{
                            if(matches){
                                if(user_in_DB.is_active){
                                    dataBase.add_in_sessions_control({sid: req.session.id, uid: user_in_DB.id})
                                    .then(()=>{
                                        req.session.user = user_in_DB
                                        logger.info('AUTH.LOGIN => NEXT')
                                        next()
                                    })
                                    .catch(err=>{
                                        logger.warn(err.message, 'ERROR add_in_sessions_control')
                                        err.message === `SQLITE_CONSTRAINT: UNIQUE constraint failed: sid_uid.uid` ? res.status(401).json({message: 'session utilisateur déjà ouverte'}) : res.status(401).json({message: 'access denied'})
                                    })
                                }else{
                                    req.session.user = user_in_DB
                                    logger.info('AUTH.LOGIN => NEXT')
                                    next()
                                }  
                            }else{
                                logger.warn(`bad password`)
                                res.status(401).json({message: 'access denied'})
                            }
                        })
            }else{
                if(user_password === user_in_DB.password){
                    req.session.user = user_in_DB
                    next()
                }else{
                    logger.warn(`bad password`)
                    res.status(401).json({message: 'access denied'})
                }
            }
            
        })
        .catch(err=>{
            console.error(err)
            res.status(500).json({message: 'Internal error'})
        })
}

// exports.active_user_account = (req, res)=>{
//     logger.warn(req.body.password, 'REQ.BODY.PASSWORD')
//     dataBase.update({
//         id: req.auth.userId,
//         password: req.body.password ,
//         is_active: 1
//     }, "user").then(result=>{
//         logger.info(result, 'User account actived')
//         const token = jwt.create(
//             {id: req.body.user_in_DB.id, isAdmin: req.body.user_in_DB.is_admin},
//             this.mdpToken,
//             { expiresIn: '1h' }
//             )
//         res.status(200).json({message: 'User account actived', token: token})
//     }).catch(err=>{
//         logger.error('Internal error during account activation', 'TITRE')
//         logger.error(err, 'CONTENU')
//         logger.error(req.headers, 'REQ.HEADERS')
//         logger.error(req.body, 'REQ.BODY')
//         res.status(500).json({message: 'internal error'})
//     })
// }

exports.active_user_account = (req, res) => {

    const email_in_req = req.body.email;
    const email_in_session = jwt.verify(`${req.session.user.email}`,config.crypt.emailInDB)
    let newPassword = req.body.newPassword

    if(email_in_req !== email_in_session || req.body.password === newPassword){
        res.status(401).json({message: 'acces denied'})
    }else{
        (()=>{
            if(config.crypt.passwordInDB){
                return argon2.hash(newPassword)
                    .then(encryptedNewPassword =>{
                        newPassword = encryptedNewPassword
                        return Promise.resolve(newPassword)
                    })
            }else{
                return Promise.resolve(newPassword)
            }
        })()
        .then(newPassword => {
        newUserData = {
            id: req.session.user.id,
            password: newPassword,
            is_active: 1
        }
        return dataBase.update(newUserData, "user")})
        .then(()=>{
            logger.warn('compte activé en DB')
            req.session.user.password = newPassword
            req.session.user.is_active = 1;
            res.status(200).json({message : 'User account actived'})
        })
        .catch(err=>{
            logger.error('Internal error during activation user account', 'TITRE')
            logger.error(err, 'CONTENU')
            res.status(500).json({message : 'Internal error'})
        })
    }
    
}

exports.emailToAdmin = (req, res)=>{
    logger.info(config.adminEmail, 'ADMIN EMAIL')
    email.sendEmail({
        message: `L'utilisateur de groupomania Réseau Social: ${req.body.email}, demande une réinitialisation du mot de passe`,
        subject: 'réinitialisation du mot de passe',
        admin_email: config.adminEmail})
        .then((response)=>{
            logger.info(response)
            res.status(200).json({message: "Email de demande de réinitialisation du mot de passe envoyé à l'administrateur du site"})
        })
        .catch(err=>{
            logger.error(err)
            res.status(500).json({message: `Erreur interne, veuillez contacter l'administrateur de ${config.siteDomain}.`})
        })
}

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
            password: password,
            is_active: 1
        }
        if(!user.name) user.name = req.body.email.split('@')[0]
        if(!user.profile_picture_url) user.profile_picture_url = 'default_url_avatar_picture'
        return dataBase.insertUser(user)    
    })
    .then(()=>{
        logger.info(req.body.email, "CREATED USER")
        res.status(201).json({message: "Nouvel utilisateur créé"})
    })
    .catch(err => {
        logger.error("Creating new user echec", 'TITRE')
        logger.error(err, "CONTENU") 
        res.status(500).json({message: 'Echec création nouvel utilisateur'})
    })
}