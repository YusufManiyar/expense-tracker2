const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  status: {
    type: String,
    required: true
  },
  orderid: {
    type: String
  },
  paymentid: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // refers to the User model
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);







// const { DataTypes } = require('sequelize');
// const sequelize = require('../utils/data-config.js')
// const User = require('./user.js')

// const Order = sequelize.define('Order', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//         },
//     status: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     orderid: {
//         type: DataTypes.STRING
//     },
//     paymentid: {
//         type: DataTypes.STRING
//     },
// });

// User.hasMany(Order)
// Order.belongsTo(User, { foreignKey: 'UserId' });

// module.exports = Order;