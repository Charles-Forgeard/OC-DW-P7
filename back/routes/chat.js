const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const lastMsgCtrl = require('../controllers/lastMsg')

router.get('/lastMsg', auth.is_active, lastMsgCtrl)

module.exports = router
