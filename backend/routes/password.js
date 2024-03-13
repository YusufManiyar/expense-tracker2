const express = require('express')
const passwordController = require('../controller/password.js') 
const autho = require('../middleware/autho.js')
const router = express.Router()

router.post('/forgetpassword', passwordController.forgetPassword)
router.get('/resetpassword/:id', passwordController.resetPassword)
router.post('/updatepassword', passwordController.updatePassword)

module.exports = router
