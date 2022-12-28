const logger = require('../../logger/console-dev')();
const jwt = require('../crypt/generate-verify-jwt')
const mdpGenerator = require('../crypt/generate-password');
const dataBase = require('../../dataBase/dataBase')
const config = require('../../config');
const argon2 = require('../crypt/generate-verify-hash');

module.exports = (req, res, next) => {
    logger.info(req.body.newPassword, 'REQ.BODY.NEWPASSWORD')
    if(config.crypt.emailInDB){
        const email_in_token = jwt.verify(`${req.auth.email}`,config.crypt.emailInDB)
    }else{
        const email_in_token = req.auth.email
    }

    if(email_in_token !== req.body.email || req.body.password === req.body.newPassword){
        res.status(401).json({message: 'acces denied'})
    }else{
        (()=>{
            if(config.crypt.passwordInDB){
                return argon2.hash(req.body.newPassword)
            }else{
                return Promise.resolve(req.body.newPassword)
            }
        })()
        .then(newPassword => {
        newUserData = {
            id: req.auth.id,
            password: newPassword,
            is_active: 1
        }
        return dataBase.update(newUserData, "user")})
        .then(()=>{
            res.status(200).json({message : 'User account actived'})
        })
        .catch(err=>{
            logger.error('Internal error during activation user account', 'TITRE')
            logger.error(err, 'CONTENU')
            res.status(500).json({message : 'Internal error'})
        })
    }
    
}
