const sqlite3 = require('sqlite3')
const path = require('path')
const logger = require('../modules/logger/console-dev')
const sql_limit_posts = `
WITH likes AS (
    SELECT COUNT(*) as count, post_id FROM post_user GROUP BY post_id
)
SELECT
subPost.id,
subPost.text_content,
subPost.creation_date,
subPost.amend_date,
subPost.author_id,
user.name as author_name,
user.firstname as author_firstname,
user.profile_picture_url as author_profile_picture_url,
picture.picture_url,
picture.id as picture_id,
likes.count as likes,
post_user.user_id as liked_by_user
FROM (SELECT post.id,
post.text_content,
post.creation_date,
post.amend_date,
post.author_id FROM post 
ORDER BY post.creation_date DESC
LIMIT ? OFFSET ?) as subPost
INNER JOIN user ON subPost.author_id = user.id
LEFT JOIN picture ON subPost.id = picture.post_id
LEFT JOIN likes ON subPost.id = likes.post_id
LEFT JOIN post_user ON (? = post_user.user_id AND subPost.id = post_user.post_id)
`
const sql_post = `SELECT * FROM post WHERE id = ?`
const sql_users = `SELECT * FROM user`
const sql_Post_Images = `SELECT * FROM picture WHERE post_id = ?`
const sql_get_sid_uid = `SELECT * FROM sid_uid WHERE uid = ?`
const sql_insert_user = `INSERT INTO user (
    email,
    profile_picture_url,
    password,
    name,
    firstname,
    position,
    is_active,
    is_admin
) VALUES (?,?,?,?,?,?,?,?)`
const sql_insert_post = `INSERT INTO post (
    text_content,
    creation_date,
    author_id
) VALUES ( ?, ?, ?)`
const sql_delete_user = `DELETE FROM user WHERE id = ?`
const sql_delete_post = `DELETE FROM post WHERE id = ?`
const sql_delete_post_user = `DELETE FROM post_user WHERE user_id = ? AND post_id = ?`
const sql_delete_picture = `DELETE FROM picture WHERE id = ?`
const sql_insert_post_user = `INSERT INTO post_user (
    user_id,
    post_id,
    datetime_like
) VALUES ( ?, ?, ?)`
const sql_delete_sid_uid = `DELETE FROM sid_uid WHERE sid = ?`
const sql_delete_expired_sessions = `DELETE FROM sessions WHERE expired < ?`
const sql_delete_session = `DELETE FROM sessions WHERE sid = ?`

function openDB(opening_mode) {
  const db = new sqlite3.Database(
    path.join(__dirname, './db.sqlite'),
    opening_mode,
    (err) => {
      if (err) {
        logger.error(err.message, 'DATABASE OPENING FAILED')
        throw new Error(err)
      }
    }
  )
  db.get('PRAGMA foreign_keys = ON')
  return db
}

const DB_All = (sql_req, values) => {
  logger.info(
    `SQL request: ${sql_req} \n\nwith args: [${values}]\n`,
    'DATABASE'
  )
  return new Promise((resolve, reject) => {
    const db = openDB(sqlite3.OPEN_READONLY)
    db.all(sql_req, values, (err, rows) => {
      db.close()
      if (err) {
        const _err = new Error(err.message)
        _err.code = err.code
        _err.errno = err.errno
        reject(_err)
      }
      resolve(rows)
    })
  })
}

const DB_Get = (sql_req, values) => {
  logger.info(`SQL request: ${sql_req} with args: [${values}]`, 'DATABASE')
  return new Promise((resolve, reject) => {
    const db = openDB(sqlite3.OPEN_READONLY)
    db.get(sql_req, values, (err, row) => {
      db.close()
      if (err) {
        const _err = new Error(err.message)
        _err.code = err.code
        _err.errno = err.errno
        reject(_err)
      }
      resolve(row)
    })
  })
}

const DB_Insert = (sql_req, values) => {
  logger.info(`SQL request: ${sql_req} with args: [${values}]`, 'DATABASE')
  return new Promise((resolve, reject) => {
    const db = openDB(sqlite3.OPEN_READWRITE)
    db.run(sql_req, values, function err(err) {
      // logger.info(this.bind(err), 'THIS INSERT')
      // const THIS = this.bind(err).lastID
      db.close()
      if (err) {
        const _err = new Error(err.message)
        _err.code = err.code
        _err.errno = err.errno
        reject(_err)
      }
      resolve(this.lastID)
    })
  })
}

const DB_Delete = (sql_req, values) => {
  if (sql_req !== sql_delete_expired_sessions)
    logger.info(`SQL request: ${sql_req} with args: [${values}]`, 'DATABASE')
  return new Promise((resolve, reject) => {
    const db = openDB(sqlite3.OPEN_READWRITE)
    //db.get("PRAGMA foreign_keys = ON")
    db.run(sql_req, values, (err) => {
      db.close()
      if (err) {
        const _err = new Error(err.message)
        _err.code = err.code
        _err.errno = err.errno
        reject(_err)
      }
      resolve(this)
    })
  })
}

const DB_Update = (sql_req, values) => {
  logger.info(`SQL request: ${sql_req} with args: [${values}]`, 'DATABASE')
  return new Promise((resolve, reject) => {
    const db = openDB(sqlite3.OPEN_READWRITE)
    db.run(sql_req, values, function err(err) {
      db.close()
      if (err) {
        const _err = new Error(err.message)
        _err.code = err.code
        _err.errno = err.errno
        reject(_err)
      }
      resolve(this)
    })
  })
}

exports.getAllUsers = () => {
  return DB_All(sql_users)
}

exports.getAllPosts = async ({ user_id, limit, offset }) => {
  const messagesRows = await DB_All(sql_limit_posts, [limit, offset, user_id])

  const messages = messagesRows.reduce((arr, message) => {
    message.pictures = {}
    if (message.picture_url) {
      message.pictures[message.picture_id] = message.picture_url
    }
    const lastMessage = arr[arr.length - 1]
    if (!arr.length || lastMessage?.id !== message.id) {
      delete message.picture_id
      delete message.picture_url
      return [...arr, message]
    }
    arr[arr.length - 1].pictures[message.picture_id] = message.picture_url
    return arr
  }, [])
  return messages
}

exports.getPost = ({ post_id, col_name }) => {
  let local_sql_req
  if (col_name) {
    local_sql_req = sql_post.replace('*', col_name)
  }
  return Number.isInteger(post_id)
    ? DB_Get(local_sql_req, [post_id])
    : Promise.reject(
        new Error(
          `La valeur donnée en argument à la méthode getPost est "${post_id}", or il doit être un nombre entier`
        )
      )
}

exports.getAllPostImages = ({ post_id }) => {
  return Number.isInteger(post_id)
    ? DB_All(sql_Post_Images, [post_id])
    : Promise.reject(
        new Error(
          `La valeur donnée en argument à la méthode getAllPostImages est "${post_id}", or il doit être un nombre entier`
        )
      )
}

exports.getUser = (user) => {
  const keys = Object.keys(user)
  const key = keys[0]
  const value = Object.values(user)[0]
  let sql_req = `SELECT * FROM user WHERE ${key} = ?`
  return keys.length === 1
    ? DB_Get(sql_req, [value]).catch((err) => logger.error(err))
    : Promise.reject(
        new Error(
          `La valeur donnée en argument à la méthode getUser doit être un object avec une clé et valeur unique. Ici = ${user}`
        )
      )
}

exports.insertUser = (user) => {
  return DB_Insert(sql_insert_user, [
    user.email,
    user.profile_picture_url,
    user.password,
    user.name,
    user.firstname,
    user.position,
    user.is_active,
    user.is_admin,
  ])
}

exports.insertPost = ({ text_content, author_id }) => {
  //Check the argument's properties
  const typeofText_content = typeof text_content
  const text_contentIsString = typeofText_content === 'string'
  const typeofCreated_by = typeof author_id
  const created_byIsNumber = typeofCreated_by === 'number'

  if (!text_contentIsString || !created_byIsNumber) {
    return Promise.reject(
      new Error(
        `New post must contain text_content and created_by properties respectively of string${
          text_contentIsString ? '' : ' (not ' + typeofText_content + ')'
        } and number${
          created_byIsNumber ? '' : ' (not ' + typeofCreated_by + ')'
        } type.`
      )
    )
  }

  const creation_date = Math.trunc(Date.now() / 1000)

  return DB_Insert(sql_insert_post, [text_content, creation_date, author_id])
}

exports.deleteUser = (user_id) => {
  return Number.isInteger(user_id)
    ? DB_Delete(sql_delete_user, [user_id])
    : Promise.reject(
        new Error(
          `La valeur donnée en argument à la méthode deleteUser est "${user_id}", or il doit être un nombre entier`
        )
      )
}

exports.deletePost = (post_id) => {
  return Number.isInteger(post_id)
    ? DB_Delete(sql_delete_post, [post_id])
    : Promise.reject(
        new Error(
          `La valeur donnée en argument à la méthode deleteUser est "${post_id}", or il doit être un nombre entier`
        )
      )
}

exports.deletePicture = (picture_id) => {
  logger.info(`SQL request: ${sql_delete_picture} VALUES (${picture_id})`)
  return Number.isInteger(picture_id)
    ? DB_Delete(sql_delete_picture, [picture_id])
    : Promise.reject(
        new Error(
          `La valeur donnée en argument à la méthode deleteUser est "${picture_id}", or il doit être un nombre entier`
        )
      )
}

exports.update = (row, tableName) => {
  //Check the arguments
  switch (true) {
    case tableName !== 'post' && tableName !== 'user':
      return Promise.reject(
        new Error(`Second argument must be 'user' | 'post', not "${tableName}"`)
      )
    case !row.id && !row.email:
      return Promise.reject(
        new Error(
          `First argument must contain at least one id or email property, who is actually "id:${row.id} email:${row.email}"`
        )
      )
    case Object.keys(row).length < 2:
      return Promise.reject(
        new Error(
          `First argument must contain at least one property to update"`
        )
      )
  }
  //sql request construction with row object
  const { id, ...rest } = row
  const cleanRest = {}
  for (const [key, value] of Object.entries(rest)) {
    if (value) {
      cleanRest[key] = value
    }
  }
  let email
  if (cleanRest.email && !id) {
    email = cleanRest.email
    delete cleanRest.email
  }
  logger.warn(cleanRest)
  const keys = Object.keys(cleanRest)
  const values = [...Object.values(cleanRest), id ?? email]

  const sql_update_user = `UPDATE ${tableName} SET ${keys.join(
    ' = ? , '
  )} = ? WHERE ${id ? 'id' : 'email'} = ?`

  return DB_Update(sql_update_user, values)
}

exports.insertPicture = ({ url, post_id }) => {
  const sql_insert_picture = `INSERT INTO picture (picture_url, post_id) VALUES ("${url}", ${post_id})`
  logger.info(sql_insert_picture)
  return DB_Insert(sql_insert_picture)
}

exports.insertPost_user = ({ userID, postID, datetime_inSeconds }) => {
  return DB_Insert(sql_insert_post_user, [userID, postID, datetime_inSeconds])
}

exports.deletePost_user = ({ userID, postID }) => {
  return DB_Delete(sql_delete_post_user, [userID, postID])
}

const req_sql_add_sid_uid_row = `INSERT INTO sid_uid (sid,uid) VALUES (?,?)`

exports.add_sid_uid = ({ sid, uid }) => {
  return DB_Insert(req_sql_add_sid_uid_row, [sid, uid])
}

exports.delete_sid_uid = ({ sid }) => {
  return DB_Delete(sql_delete_sid_uid, [sid])
}

exports.get_sid_uid = ({ uid }) => {
  return DB_Get(sql_get_sid_uid, [uid])
}

exports.delete_session = ({ sid }) => {
  return DB_Delete(sql_delete_session, [sid])
}

exports.clear_sessions = () => {
  const date = Date.now()
  return DB_Delete(sql_delete_expired_sessions, [date])
}
