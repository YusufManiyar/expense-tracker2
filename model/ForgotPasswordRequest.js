const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const forgotPasswordRequestSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4 // UUID as custom _id
  },
  isactive: {
    type: Boolean,
    default: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ForgotPasswordRequest', forgotPasswordRequestSchema);







// const { DataTypes } = require('sequelize');
// const sequelize = require('../utils/data-config.js');
// const User = require('./user.js')

// const ForgotPasswordRequest = sequelize.define('ForgotPasswordRequest', {
//     id: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         primaryKey: true,
//     },
//     isactive: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: true,
//     },
// });

// ForgotPasswordRequest.belongsTo(User, { foreignKey: 'userId' });

// module.exports = ForgotPasswordRequest;
