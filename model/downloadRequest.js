const { DataTypes } = require('sequelize');
const User = require('./user.js')
const sequelize = require('../utils/data-config.js'); // Assuming you have configured Sequelize

const DownloadRequest = sequelize.define('DownloadRequest', {
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

User.hasMany(DownloadRequest, { foreignKey: 'userId' })
DownloadRequest.belongsTo(User, { foreignKey: 'userId' })

module.exports = DownloadRequest;
