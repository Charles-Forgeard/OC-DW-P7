const express = require('express');
// const verifEmail = require('../middleware/verifEmail');
const router = express.Router();
const rateLimit = require('../middleware/rate-limit');
const auth = require('../middleware/auth');
const path = require('path');

const lastMsgCtrl = require('../controllers/lastMsg');

router.use('/dist/',express.static(path.join(__dirname, '../..','/front/')))

router.use('/static/js/', express.static(path.join(__dirname, '../..','/build/static/js/')))

router.get('/dist/socket.io.min.js', auth.is_active, (req, res) => res.status(200).sendFile(path.join(__dirname, '../..', '/node_modules/socket.io/client-dist/socket.io.min.js')))

router.get('/lastMsg', auth.is_active, lastMsgCtrl)

router.get('/', (req,res)=>{
    res.status(200).sendFile(path.join(__dirname, '../..', '/build/index.html'))
})

module.exports = router;