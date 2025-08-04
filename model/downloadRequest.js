const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const downloadRequestSchema = new Schema({
  fileUrl: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // references User model
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('DownloadRequest', downloadRequestSchema);






// const { DataTypes } = require('sequelize');
// const User = require('./user.js')
// const sequelize = require('../utils/data-config.js'); // Assuming you have configured Sequelize

// const DownloadRequest = sequelize.define('DownloadRequest', {
//   fileUrl: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false
//   }
// });

// User.hasMany(DownloadRequest, { foreignKey: 'userId' })
// DownloadRequest.belongsTo(User, { foreignKey: 'userId' })

// module.exports = DownloadRequest;
