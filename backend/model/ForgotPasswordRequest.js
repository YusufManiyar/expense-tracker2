const { DataTypes } = require('sequelize');
const sequelize = require('../utils/data-config.js');
const User = require('./user.js')

const ForgotPasswordRequest = sequelize.define('ForgotPasswordRequest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    isactive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
});

ForgotPasswordRequest.belongsTo(User, { foreignKey: 'userId' });

module.exports = ForgotPasswordRequest;
