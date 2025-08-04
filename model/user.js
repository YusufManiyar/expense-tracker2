const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  ispremiumactive: {
    type: Boolean,
    default: false
  },
  totalAmount: {
    type: Number,
    default: 0
  }
});

exports.User = mongoose.model('User', userSchema);



// // models/user.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../utils/data-config.js')

// const User = sequelize.define('User', {
//   username: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   ispremiumactive: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false
//   },
//   totalAmount: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     defaultValue: 0
//   }
// });


// module.exports = User;