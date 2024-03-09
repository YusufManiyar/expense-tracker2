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

Expense.afterCreate(async (expense, options) => {
  try {
      const user = await User.findByPk(expense.userId);
      const totalAmount = await Expense.sum('amount', { where: { userId: expense.userId } });
      await user.update({ totalAmount });
      console.log(`Total expense updated for user ${user.id}`);
  } catch (error) {
      console.error('Error updating total expense:', error);
  }
});


module.exports = Expense;