const express = require('express')
const expenseController = require('../controller/expense.js') 
const autho = require('../middleware/autho.js')
const router = express.Router()

router.get('/expense',autho.verifyToken, expenseController.fetch)
router.post('/expense', autho.verifyToken, expenseController.add)
router.put('/expense', autho.verifyToken, expenseController.update)
router.delete('/expense', autho.verifyToken, expenseController.delete)

module.exports = router
