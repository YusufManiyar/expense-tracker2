const express = require('express')
const usersController = require('../controller/user.js') 
const auth = require('../middleware/autho.js')
const router = express.Router()

router.post('/signup', usersController.signup, auth.generateToken)
router.post('/login', usersController.login, auth.generateToken)
router.get('/showdownloadedfiles', auth.verifyToken, usersController.getDownloadLogs)

module.exports = router