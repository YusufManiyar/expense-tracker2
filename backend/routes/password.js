const express = require('express')
const passwordController = require('../controller/password.js') 
const autho = require('../middleware/autho.js')
const router = express.Router()

router.post('/forgetpassword', passwordController.forgetPassword)
// router.post('/password/changePassword', autho.verifyToken, passwordController.changePassword)

module.exports = router
