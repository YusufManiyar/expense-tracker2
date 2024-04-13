// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/data-config.js')

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ispremiumactive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  totalAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
});


module.exports = User;