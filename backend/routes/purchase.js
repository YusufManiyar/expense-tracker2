const express = require('express')
const purchaseController = require('../controller/purchase.js') 
const autho = require('../middleware/autho.js')
const router = express.Router()

router.get('/purchase/premiummembership',autho.verifyToken, purchaseController.purchase)
router.post('/purchase/updatetransationstatus', autho.verifyToken, purchaseController.updateTransactionStatus)

module.exports = router
