const express = require('express')
const usersController = require('../controller/user.js') 
const auth = require('../middleware/autho.js')
const router = express.Router()

router.post('/signup', usersController.signup)
router.post('/login', usersController.login, auth.generateToken);

module.exports = router