const logger = require('../../logger/console-dev')()
const dataBase = require('../../dataBase/dataBase')
const config = require('../../config')
const jwt = require('../crypt/generate-verify-jwt')
const argon2 = require('../crypt/generate-verify-hash');
const {writeFile, deleteFile} = require('../writeFile/writeFile')

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif'
};

module.exports = (io, socket) =>{

    const user = socket.request.session.user

    const login = ({email, password})=>{
        const user_email = config.crypt.emailInDB ? jwt.create(email,config.crypt.emailInDB) : email
        const user_password = password
        return dataBase.getUser({email: user_email})
            .then(user_in_DB => {
                if(!user_in_DB){
                    logger.warn(`user unknown in DB: ${email}`, 'SOCKET ON user:update LOGIN')
                    return Promise.reject(new Error('user unknown'))
                }else{
                    if(config.crypt.passwordInDB){
                    return argon2.verify(user_in_DB.password, user_password)
                            .then(matches=>{
                                if(matches){
                                    logger.info('argon2 verify= success','SOCKET ON user:update LOGIN')
                                    return Promise.resolve(user_in_DB)
                                }else{
                                    logger.warn(`bad password, user: ${email}`, 'SOCKET')
                                    return Promise.reject(new Error('bad password'))
                                }
                            })
                    }
                }
            })
    }

    const updateUser = ({toUpdate: {name, firstname, email, newEmail, newPassword, profile_picture}, login : {logEmail, logPassword}})=>{
        logger.info(`{name: ${name}, firstname: ${firstname}, email: ${email}, newPassword: ${newPassword}, profile_picture: ${profile_picture}}` , 'SOCKET ON user:update')

        login({email: logEmail, password: logPassword})
            .then( async (user_in_DB)=>{
                const promises = []
                
                if(config.crypt.emailInDB && email){
                    email = jwt.create(
                        email,
                        config.crypt.emailInDB
                        //no expiration time
                    )
                }

                logger.warn(user.email, 'SOCKET ON user:update userToUpdate')

                const userToUpdate = await dataBase.getUser({email: email || user.email})
                            


                logger.warn(userToUpdate, 'SOCKET ON user:update userToUpdate')


                let isInactivedAccount;

                if((user_in_DB.id !== user.id && !user_in_DB.is_admin) || (userToUpdate.id !== user_in_DB.id && !user_in_DB.is_admin)){
                    logger.warn(`User (id: ${user.id}) attempted to update another user account (id: ${user_in_DB.id})`,'SOCKET login for update user account')
                    socket.emit('user:update', {status: 401})
                    return Promise.reject(new Error('Forbidden request'))
                } 

                function formatUrlPicture(customFile){
                    const fileName = customFile.name.split('.').slice(0,-1).join('.')
                    const typeMime = MIME_TYPES[customFile.type]
                    const completeFileName = `${fileName}${timeStamp}.${typeMime}`
                    return  `front/img/users/${completeFileName}`
                }

                if(newPassword){
                    if(config.crypt.passwordInDB){
                        newPassword = await argon2.hash(newPassword)
                    }
                    if(config.accessControlByAdmin && user_in_DB.is_admin){
                        isInactivedAccount = true;
                    }
                }

                if(newEmail){
                    if(config.crypt.emailInDB){
                            newEmail = jwt.create(
                                `${newEmail}`,
                                config.crypt.emailInDB
                                //no expiration time
                            )
                    }
                }

                if(profile_picture){
                    if(user_in_DB.profile_picture_url !== 'default_url_avatar_picture'){
                        promises.push(
                            deleteFile(user_in_DB.profile_picture_url)
                        )
                    }
                    promises.push(
                        writeFile(formatUrlPicture(profile_picture), profile_picture.buffer)
                    )
                }

                

                promises.push(
                    dataBase.update(
                            {
                                id: userToUpdate.id, 
                                name: name, 
                                firstname: firstname, 
                                email: newEmail, 
                                password: newPassword, 
                                profile_picture_url: profile_picture ? formatUrlPicture(profile_picture) : null,
                                is_active: isInactivedAccount ? 0 : 1
                            } , 
                            'user'
                    )
                )

                return Promise.all(promises)
            })
            .then(()=>{
                logger.info('success', 'SOCKET ON user:update')
                socket.emit('user:update', {status: 204})
            })
            .catch(err=>{
                if(err.message === 'user unknown' || err.message === 'bad password'){
                    logger.warn(err, 'SOCKET login for update user account')
                    socket.emit('user:update', {status: 401})
                }else{
                    logger.error(err, 'SOCKET ON user:update')
                    socket.emit('user:update', {status: 500})
                }
            })
                     
    }
    
    socket.on('user:update', updateUser)
    
}