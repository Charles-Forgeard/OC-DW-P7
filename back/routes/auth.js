const express = require('express');
// const verifEmail = require('../middleware/verifEmail');
const config = require('../../config');
const router = express.Router();
const rateLimit = require('../middleware/rate-limit');
const auth = require('../middleware/auth');
const logger = require('../../logger/console-dev')();

const adminCtrl = require('../controllers/admin');
const authCtrl = require('../controllers/auth');

// router.post('/login', verifEmail, authCtrl.postSignup);
router.post('/createUser',authCtrl.isAdmin, adminCtrl.createUser);
router.post('/login', authCtrl.login, authCtrl.isActive);
router.post('/active_user_account', auth.is_not_active, authCtrl.active_user_account);
router.post('/alertAdmin', authCtrl.emailToAdmin)
if(!config.accessControlByAdmin){
    router.post('/register', authCtrl.createUser)
}
//router.post('/login', rateLimit.loginRequest, authCtrl.postLogin);

module.exports = router;