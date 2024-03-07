const express = require('express')
const leaderboardController = require('../controller/leaderboard.js') 
const autho = require('../middleware/autho.js')
const router = express.Router()

router.get('/leaderboard', autho.verifyToken, leaderboardController.fetch);


module.exports = router