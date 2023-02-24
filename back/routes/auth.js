const express = require('express')
const router = express.Router()
const authCtrl = require('../controllers/auth')

router.post('/login', authCtrl.login, authCtrl.isActive)
router.post('/activeUserAccount', authCtrl.activeUserAccount)
router.post('/register', authCtrl.createUser)

module.exports = router
