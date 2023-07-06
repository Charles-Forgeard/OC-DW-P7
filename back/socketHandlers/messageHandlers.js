const logger = require('../modules/logger/console-dev')
const dataBase = require('../dataBase/dataBase')
const { writeFile, deleteFile } = require('../modules/writeFile/writeFile')

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

async function writePictureInDB(postId, pictureFilesArray) {
  const pictures = {}
  const promises = []
  for (const file of pictureFilesArray) {
    const timeStamp = Date.now()
    const fileName = file.name.split('.').slice(0, -1).join('.')
    const typeMime = MIME_TYPES[file.type]
    const completeFileName = `${fileName}${timeStamp}.${typeMime}`
    const completeUrl = `img/messages/${completeFileName}`
    promises.push(
      writeFile(`private/${completeUrl}`, file.buffer).then(() => {
        return dataBase
          .insertPicture({ url: completeUrl, post_id: postId })
          .then((pictureId) => {
            pictures[pictureId] = completeUrl
          })
      })
    )
  }
  await Promise.all(promises)
  return pictures
}

const updateMsg = async (updates, io, user) => {
  logger.debug('updatesMsg')
  const timeStamp = Math.trunc(Date.now() / 1000)
  const picturesIdToDelete = []

  await dataBase.update(
    {
      id: updates.id,
      text_content: updates.text_content,
      amend_date: timeStamp,
    },
    'post'
  )

  if (updates.picturesToDelete.length) {
    const promise = []
    updates.picturesToDelete.forEach((picture) => {
      promise.push(
        deleteFile(
          `private/img/${decodeURI(picture.url).split('img')[1]}`
        ).then(() => {
          picturesIdToDelete.push(picture.id)
          dataBase.deletePicture(parseInt(picture.id))
        })
      )
    })
    await Promise.all(promise)
  }

  let newPicturesInDB = []

  if (updates.files) {
    const newPicturesInDBObject = await writePictureInDB(
      updates.id,
      updates.files
    )

    newPicturesInDB = Object.keys(newPicturesInDBObject).map((pictureId) => {
      return { id: pictureId, url: newPicturesInDBObject[pictureId] }
    })
  }

  logger.info({
    id: updates.id,
    amend_date: timeStamp,
    text_content: updates.text_content,
    picturesIdToDelete: picturesIdToDelete,
    newPictures: newPicturesInDB,
  })

  io.of('/socket/').emit('msg:update', {
    updates: {
      id: updates.id,
      amend_date: timeStamp,
      text_content: updates.text_content,
      picturesIdToDelete: picturesIdToDelete,
      newPictures: newPicturesInDB,
    },
    initBy: user.id,
  })
}

module.exports = (io, socket) => {
  const user = socket.request.session.user

  const createNewMessage = async ({ text_content, files }) => {
    logger.debug(user)
    logger.debug(socket.request.session.id)
    logger.info(
      `New msg sent: {text_content: ${text_content}, files: ${files}} by user ${user.id} on socket ${socket.id}`,
      'SOCKET'
    )
    try {
      if (!text_content || text_content === '') throw new Error('text empty')

      const newPostIdInDB = await dataBase.insertPost({
        text_content: text_content,
        author_id: user.id,
      })

      const timeStamp = Date.now()

      let newPicturesInDB = {}
      if (files) {
        newPicturesInDB = await writePictureInDB(newPostIdInDB, files)
      }

      io.of('/socket/')
        .to('main room')
        .emit('msg:create', {
          message: {
            text_content: text_content,
            pictures: newPicturesInDB,
            id: newPostIdInDB,
            creation_date: Math.trunc(timeStamp / 1000),
            author_name: user.name,
            author_firstname: user.firstname,
            author_profile_picture_url: user.profile_picture_url,
            author_id: user.id,
            likes: 0,
          },
          initBy: user.id,
        })
    } catch (err) {
      logger.error(err, 'SOCKET msg:create')
      socket.emit('msg:create', {
        status: 500,
        initBy: user.id,
        errMessage:
          "La requete a rencontré une erreur. Si l'erreur se reproduit, merci de contacter l'administrateur",
      })
    }
  }

  const likeMessage = async (postID) => {
    const timeStamp = Math.trunc(Date.now() / 1000)
    try {
      await dataBase.insertPost_user({
        userID: user.id,
        postID: postID,
        datetime_inSeconds: timeStamp,
      })

      io.of('/socket/').emit('msg:like', {
        postID: postID,
        operation: 'increment',
        initBy: user.id,
      })

      logger.info(
        `like by user.id: ${user.id} on message.id: ${postID} recorded`,
        'SOCKET lsg:like LIKE'
      )
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        await dataBase.deletePost_user({ userID: user.id, postID: postID })
        io.of('/socket/').emit('msg:like', {
          postID: postID,
          operation: 'decrement',
          initBy: user.id,
        })
        logger.info(
          `like by user.id: ${user.id} on message.id: ${postID} deleted`,
          'SOCKET msg:like DISLIKE'
        )
      } else {
        logger.error(err, 'SOCKET msg:like')
        io.of('/socket/').emit('msg:like', {
          postID: postID,
          initBy: user.id,
          errMessage:
            "La requete a rencontré une erreur. Si l'erreur se reproduit, merci de contacter l'administrateur",
        })
      }
    }
  }

  const updateMessage = async (updates) => {
    logger.info(updates, 'SOCKET msg:update')

    try {
      if (user.is_admin) {
        await updateMsg(updates, io, user)
      } else {
        const { author_id } = await dataBase.getPost({
          post_id: updates.id,
          col_name: 'author_id',
        })
        author_id === user.id
          ? updateMsg(updates, io, user)
          : new Error('Forbidden action')
      }
    } catch (err) {
      logger.error(err)
      socket.emit('msg:update', {
        status: err.message === 'Forbidden action' ? 401 : 500,
        initBy: user.id,
        errMessage:
          err.message === 'Forbidden action'
            ? 'Access denied'
            : "La requete a rencontré une erreur. Si l'erreur se reproduit, merci de contacter l'administrateur",
      })
    }
  }

  const deleteMessage = (message_id) => {
    if (user.is_admin) {
      dataBase
        .getAllPostImages({ post_id: message_id })
        .then((pictures) => {
          pictures.forEach((picture) => {
            logger.warn(`private/${picture.picture_url}`)
            deleteFile(`private/${picture.picture_url}`).catch((error) => {
              logger.error(error)
            })
          })
        })
        .catch((error) => {
          logger.error(error)
        })

      dataBase.deletePost(message_id).then(() => {
        logger.info(`message.id: ${message_id}`, 'SOCKET msg:delete by admin')
        io.of('/socket/').emit('msg:delete', {
          message_id: message_id,
          initBy: user.id,
        })
      })
    } else {
      dataBase
        .getPost({ post_id: message_id, col_name: 'author_id' })
        .then((post) => {
          if (post.author_id === user.id) {
            return dataBase
              .getAllPostImages({ post_id: message_id })
              .then((pictures) => {
                pictures.forEach((picture) => {
                  deleteFile(`private/${picture.picture_url}`)
                })
              })
              .then(() => dataBase.deletePost(message_id))
          } else {
            throw new Error('unauthorized action')
          }
        })
        .then(() => {
          logger.info(`message.id: ${message_id}`, 'SOCKET msg:delete')
          io.of('/socket/').emit('msg:delete', {
            message_id: message_id,
            initBy: user.id,
          })
        })
        .catch((err) => {
          logger.error(err, 'SOCKET msg:delete')
          socket.emit('msg:update', {
            status: 500,
            initBy: user.id,
            errMessage:
              "La requete a rencontré une erreur. Si l'erreur se reproduit, merci de contacter l'administrateur",
          })
        })
    }
  }

  socket.on('msg:delete', deleteMessage)
  socket.on('msg:update', updateMessage)
  socket.on('msg:like', likeMessage)
  socket.on('msg:create', createNewMessage)
}
