const rateLimit = require('express-rate-limit');
const logger = require('../../logger/console-dev')();
const config = require('../../config');


exports.appRequest = rateLimit({
    windowsMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: false,
    legacyHeaders: false
})

exports.loginRequest = rateLimit({
    windowsMs: 1 * 60 * 1000,
    max: config.loginLimitation,
    message: () =>{
        logger.warn('Logins trop fréquents')
        return 'Logins trop fréquents'
    },
    standardHeaders: false,
    legacyHeaders: false
})