const logger = require('../modules/logger/console-dev')
const dataBase = require('../dataBase/dataBase')
const handleError = require('../modules/error/handleApiError')

module.exports = async (req, res) => {
  try {
    const messages = await dataBase.getAllPosts({
      user_id: req.session.user.id,
      limit: req.query.limit,
      offset: req.query.offset,
    })
    logger.debug(messages)
    res.status(200).json({ messages: messages })
  } catch (err) {
    handleError(err, 'LAST_MSG', res)
  }
}
