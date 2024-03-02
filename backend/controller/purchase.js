const Expense = require('../model/expense.js')
const Razorpay = require('razorpay')
const Order = require('../model/order.js')

module.exports = {
    purchase : async (req, res) => {
        try {
           let rzp = new Razorpay({
            key_id: process.env.RAZORPAY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
           })

           const amount = 2500

           rzp.orders.create({amount, currency: 'INR'}, async (err, order) => {

            if(err) {
                throw new Error(JSON.stringify(err))
            }
            await req.user.createOrder({orderid: order.id, status: 'PENDING'})
            return res.status(201).json({order, key_id: rzp.key_id})
           })
        } catch (error) {
            res.status(500).json({ message: error.toString() });
        }
    },

    updateTransactionStatus :async (req, res) => {
        try {
            const { payment_id, order_id } = req.body;
            
            const order = await Order.findOne({where: {orderid : order_id}})
            await order.update({paymentid: payment_id, status: 'SUCCESSFUL'})
            await req.user.update({ispremiumactive: true})
            res.status(202).json({success: true, message: 'Transaction Successful'});
        } catch (error) {
            res.status(400).json({ message: error.toString() });
        }
    }
}