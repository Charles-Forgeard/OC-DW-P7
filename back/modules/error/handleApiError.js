const logger = require('../logger/console-dev')

function handleError(err, entete = '', res) {
  switch (err.message) {
    case 'User unknown':
    case 'Bad password':
    case 'Bad email':
    case 'Same password':
    case 'User is not admin':
    case 'Create user by Admin is not allowed':
      logger.warn(err.message, entete, err)
      res.status(401).json({ errorMessage: 'Access denied' })
      break
    case 'SQLITE_CONSTRAINT: UNIQUE constraint failed: sid_uid.uid':
      logger.warn('Session utilisateur déjà ouverte', entete, err)
      res.status(401).json({ errorMessage: 'session utilisateur déjà ouverte' })
      break
    case 'SQLITE_CONSTRAINT: UNIQUE constraint failed: user.email':
      logger.warn('Compte utilisateur déjà existant', entete, err)
      res.status(405).json({ errorMessage: 'Compte utilisateur déjà existant' })
      break
    default:
      logger.error(err.message, entete, err)
      res.status(500).json({ errorMessage: 'Internal error' })
  }
}

module.exports = handleError
