const logger = require('../../logger/console-dev')()
const dataBase = require('../../dataBase/dataBase')
const {writeFile, deleteFile} = require('../writeFile/writeFile')

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif'
};

module.exports = (io, socket) => {

    const user = socket.request.session.user

    const createNewMessage = ({text_content, files})=>{
                logger.info(`New msg sent: {text_content: ${text_content}, files: ${files}} by user ${user.id} on socket ${socket.id}`, "SOCKET") 
            
                if(text_content && text_content !== ''){
            
                    dataBase.insertPost({text_content : text_content, author_id: user.id})
                    .then(newPost_id=>{
                        const timeStamp = Date.now()
                        const pictures= [];
                        if(files){
                            const promises = [];
                            for(const file of files){
                                const fileName = file.name.split('.').slice(0,-1).join('.')
                                const typeMime = MIME_TYPES[file.type]
                                const completeFileName = `${fileName}${timeStamp}.${typeMime}`
                                const completeUrl = `img/messages/${completeFileName}`
                                promises.push(
                                    writeFile(`front/${completeUrl}`, file.buffer)
                                    .then(()=>{return dataBase.insertPicture({url: completeUrl, post_id: newPost_id}).then(pictureId=>{
                                        pictures.push({url: completeUrl, id: pictureId})
                                    })})
                                )
                            }
                            return Promise.all(promises).then(()=>{return {
                                newPost_id: newPost_id, 
                                pictures: pictures, 
                                creation_date: Math.trunc(timeStamp/1000)
                            }})
                        }else{
                            return {
                                newPost_id: newPost_id,
                                pictures: pictures,  
                                creation_date: Math.trunc(timeStamp/1000)
                            }
                        }
                    })
                    .then(({newPost_id, pictures, creation_date})=>{
                        io.of("/socket/").to("main room").emit('msg:create', {message: {
                            text_content: text_content, 
                            pictures: pictures, 
                            id: newPost_id, 
                            creation_date: creation_date, 
                            author_name: user.name,
                            author_firstname: user.firstname,
                            author_profile_picture_url: user.profile_picture_url,
                            author_id: user.id
                        }});
                        // socket.broadcast.emit('msg', {message: message, pictures: pictures, id: newPost_id})
                    })
                    .catch(err=>{
                        logger.error(err, 'SOCKET msg:create')
                        socket.emit('msg:create', {status: 500})
                    })
                }
            }

    const likeMessage = postID => {
        const timeStamp = Math.trunc(Date.now()/1000)
        dataBase.insertPost_user({userID: user.id, postID: postID, datetime_inSeconds: timeStamp})
        .then(()=>{
            io.of("/socket/").emit('msg:like', {postID: postID, operation: 'increment'})
            logger.info(`like by user.id: ${user.id} on message.id: ${postID} recorded`, 'SOCKET lsg:like LIKE')
        })
        .catch(err=>{
            switch(true){
                case err.code === 'SQLITE_CONSTRAINT':
                    dataBase.deletePost_user({userID: user.id, postID: postID}).then(()=>{
                        io.of("/socket/").emit('msg:like', {postID: postID, operation: 'decrement'})
                        logger.info(`like by user.id: ${user.id} on message.id: ${postID} deleted`, 'SOCKET msg:like DISLIKE')
                    })
                    break;
                default:
                    logger.error(err, 'SOCKET msg:like')
            }
        })

    }

    const updateMessage = (updates)=>{
        function updateMsg(){
            const timeStamp = Math.trunc(Date.now()/1000)
            const picturesIdToDelete = []
            return dataBase.update({id: updates.id, text_content: updates.text_content, amend_date: timeStamp}, 'post')
                .then(()=>{
                    if(updates.picturesToDelete.length){
                        const promise = []
                        updates.picturesToDelete.forEach(picture =>{
                            promise.push(
                                deleteFile(`front/${decodeURI(picture.url).split('chat/')[1]}`)
                                .then(()=>{
                                    picturesIdToDelete.push(picture.id)
                                    dataBase.deletePicture(parseInt(picture.id))
                                })
                            )  
                            
                        })
                        return Promise.all(promise)
                    }
                })
                .then(()=>{
                    if(updates.files){
                        const pictures= [];
                        const promises = [];
                        for(const file of updates.files){
                            const fileName = file.name.split('.').slice(0,-1).join('.')
                            const typeMime = MIME_TYPES[file.type]
                            const completeFileName = `${fileName}${timeStamp}.${typeMime}`
                            const completeUrl = `img/messages/${completeFileName}`
                            promises.push(
                                writeFile(`front/${completeUrl}`, file.buffer)
                                .then(()=>{return dataBase.insertPicture({url: completeUrl, post_id: updates.id}).then(pictureId=>{
                                    pictures.push({url: completeUrl, id: pictureId})
                                })})
                            )
                        }
                        return Promise.all(promises).then(()=>{
                            return pictures
                        })
                    }
                })
                .then(pictures => {
                    logger.info({id: updates.id, amend_date: timeStamp, text_content: updates.text_content, picturesIdToDelete: picturesIdToDelete, newPictures: pictures})
                    io.of("/socket/").emit('msg:update', {updates:{id: updates.id, amend_date: timeStamp, text_content: updates.text_content, picturesIdToDelete: picturesIdToDelete, newPictures: pictures}})
                })
        }

        if(user.is_admin){
            updateMsg().catch(err =>{
                logger.error(err)
                socket.emit('msg:update', {status: 500})
            })
        }else{
            dataBase.getPost({post_id: updates.id, col_name: 'author_id'})
                .then(({author_id})=>{
                    if(author_id === user.id){
                        updateMsg().catch(err =>{
                            logger.error(err)
                            socket.emit('msg:update', {status: 500})
                        })
                    }
                })
        }
        
    }

    const deleteMessage = (message_id)=>{
        if(user.is_admin){
            dataBase.getAllPostImages({post_id : message_id})
                .then(pictures=>{
                    pictures.forEach(picture => deleteFile(`front/${picture.picture_url}`))
                })

            dataBase.deletePost(message_id)
                .then(()=>{
                    logger.info(`message.id: ${message_id}`, 'SOCKET msg:delete by admin')
                    io.of("/socket/").emit('msg:delete', {message_id: message_id})
                })
            
        }else{

            dataBase.getPost({post_id: message_id, col_name: 'author_id'})
                .then(post=>{
                    if(post.author_id === user.id){
                        return dataBase.deletePost(message_id)
                            .then(()=>{
                                return dataBase.getAllPostImages({post_id : message_id})
                                .then(pictures=>{
                                    pictures.forEach(picture => deleteFile(`front/${picture.picture_url}`))
                                })
                            })
                    }else{
                        throw new Error('unauthorized action')
                    } 
                })
                .then(()=>{
                    logger.info(`message.id: ${message_id}`, 'SOCKET msg:delete')
                    io.of("/socket/").emit('msg:delete', {message_id: message_id})
                })
                .catch(err=>{
                    logger.error(err, 'SOCKET msg:delete')
                    socket.emit('msg:update', {status: 500})
                })
        }
    }

    socket.on('msg:delete', deleteMessage)
    socket.on('msg:update', updateMessage)
    socket.on('msg:like', likeMessage)
    socket.on('msg:create', createNewMessage)
}
