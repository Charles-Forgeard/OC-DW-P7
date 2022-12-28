const logger = require('../../logger/console-dev')();
const dataBase = require('../../dataBase/dataBase')
const config = require('../../config');

module.exports = (req, res, next) =>{
    dataBase.getAllPosts({user_id: req.session.user.id, limit: req.query.limit, offset: req.query.offset})
    .then(messages => {
        res.status(200).json({messages: messages})
    })
    .catch(err=>{
        logger.error('Echec lors de la récupération des messages', 'TITRE')
        logger.error(err, 'CONTENU')
        res.status(500).json({message: 'Internal Error'})
    })
}