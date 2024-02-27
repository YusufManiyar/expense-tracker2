const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense_tracker2', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });

  module.exports = sequelize;