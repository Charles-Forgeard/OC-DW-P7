const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const imgCtrl = require('../controllers/img')

router.get(
  '/*',
  (req, res, next) => {
    console.log('route atteinte')
    next()
  },
  auth.is_active,
  imgCtrl.getImage
)

module.exports = router
