// expenseModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../utils/data-config.js');
const User = require('./user.js')

const Expense = sequelize.define('Expense', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});
User.hasMany(Expense, { foreignKey: 'userId' })
Expense.belongsTo(User, { foreignKey: 'userId' });

Expense.afterBulkDestroy(handleExpenseDestroy)

async function handleExpenseDestroy(expense, options) {
  console.log(expense)
  const userId = expense.where.userId
  const amount = expense.amount
  let totalAmount = -(amount)

  try {
    const user = await User.findByPk(userId)
    totalAmount += user.totalAmount

    await user.update({ totalAmount })
    console.log(`Total expense updated for user ${userId}`);
  } catch (error) {
    console.error('Error updating total expense:', error);
    throw error
  }
};


module.exports = Expense;