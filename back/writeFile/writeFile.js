const {writeFile, unlink} = require('fs')
const logger = require('../../logger/console-dev')();

exports.writeFile = (url, file)=>{
    return new Promise((resolve, reject)=>{
        writeFile(url, file, err=>{
            if(err){
                logger.error(err, 'WRITEFILE')
                return reject(err)
            }else{
                logger.info(url + ' recorded successfully', 'WRITEFILE')
                return resolve(url)
            }
        })
    })
}

exports.deleteFile = (url)=>{
    return new Promise((resolve, reject)=>{
        unlink(url, err=>{
            if(err){
                logger.error(err, 'DELETEFILE')
                return reject(err)
            }else{
                logger.info(url + ' delete successfully', 'DELETEFILE')
                return resolve(url)
            }
        })
    })
}
