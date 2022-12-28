const jwt = require('jsonwebtoken');

module.exports = {
    verify : (token, secretKey) =>{
        return jwt.verify(token, secretKey)
    },
    create : (data, secretKey, expiresInObject) =>{
        return jwt.sign(
            data,
            secretKey,
            expiresInObject
        )
    }
}