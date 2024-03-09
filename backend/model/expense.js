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

Expense.afterCreate(handleExpenseChange)
Expense.afterBulkUpdate(handleExpenseChange)
Expense.afterBulkDestroy(handleExpenseChange)

async function handleExpenseChange(expense, options) {
  const userId = expense.userId ? expense.userId : expense.where.userId
  const t = await sequelize.transaction()
  try {
    const totalAmount = await Expense.sum('amount', { where: { userId }, transaction: t });
    await User.update({ totalAmount }, { where: { id: userId }, transaction: t });
    t.commit()
    console.log(`Total expense updated for user ${userId}`);
  } catch (error) {
    console.error('Error updating total expense:', error);
    t.rollback()
  }
};


module.exports = Expense;