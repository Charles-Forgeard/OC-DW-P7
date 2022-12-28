const logger = require('../../logger/console-dev')();

exports.is_not_active = (req, res, next) => {
    const isInSocketContext = req._query && typeof req._query === 'object' ? Object.keys(req._query)?.includes('EIO') : false;
    logger.info(isInSocketContext, 'isInSocketContext AUTH is_not_active')
    if(!req.session?.user){
        logger.warn(req.headers, 'ACCESS DENIED')
        if(isInSocketContext){
            req.auth = 'rejected'
            next()
        }else{
            res.status(401).json({message: 'access denied'})
        }
    }else{
        logger.info('AUTH is_not_active OK')
        next()
    }
};

exports.is_active = (req, res, next) => {
    const isInSocketContext = req._query && typeof req._query === 'object' ? Object.keys(req._query)?.includes('EIO') : false;
    logger.info(`isInSocketContext: ${isInSocketContext} / session.user.is_active: ${req.session?.user?.is_active ? true : false}`, 'AUTH is_active')
    // logger.warn(req.socket?.parser, 'SOCKET CONTEXT')
    if(!req.session?.user?.is_active){
        logger.warn(`ACCESS DENIED: req.session.user = ${req.session?.user} & user.is_active = ${req.session?.user?.is_active}`,'AUTH')
        if(isInSocketContext){
            req.auth = 'rejected'
            next()
        }else{
            res.status(401).json({message: 'access denied'})
        }
    }else{
        next()
    }
};