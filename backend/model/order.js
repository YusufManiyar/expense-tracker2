// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/data-config.js')
const User = require('./user.js')

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    orderid: {
        type: DataTypes.STRING
    },
    paymentid: {
        type: DataTypes.STRING
    },
});

User.hasMany(Order)
Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = Order;