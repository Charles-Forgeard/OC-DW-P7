const config = require('../../config');
const logger = require('../../logger/console-dev')();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.sendEmail= ({message,subject,admin_email})=>{
    const apiKey = config.elasticEmailApiKey;
    logger.info(apiKey, 'elasticEmailApiKey')
    // fetch(`https://api.elasticemail.com/v2/email/send?apiKey${apiKey}&subject${subject}&to=${user_email}&bodyText${message}&isTransactional=true&from='charlesforgeard@gmail.com'`)
    //     .then((response)=>response.json())
    //     .then(resJson=>logger.info(resJson))
    return fetch(`https://api.elasticemail.com/v2/email/send?apiKey=${apiKey}&subject=${subject}&to=${admin_email}&bodyText=${message}&isTransactional=true&from=groupomania.rs@gmail.com`)
        .then((response)=>response.json())
}

