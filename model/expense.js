const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user'); // your Mongoose User model

const expenseSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Middleware: update user's totalAmount after bulk delete
expenseSchema.post('deleteMany', async function (result) {
  const filter = this.getFilter(); // Get the query filter used for deletion

  if (filter.user) {
    try {
      const expenses = await mongoose.model('Expense').find(filter);
      const totalDeletedAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

      const user = await User.findById(filter.user);
      if (user) {
        user.totalAmount -= totalDeletedAmount;
        await user.save();
        console.log(`User ${user._id} totalAmount updated after deleting expenses.`);
      }
    } catch (err) {
      console.error('Failed to update user totalAmount after deleteMany:', err);
    }
  }
});

module.exports = mongoose.model('Expense', expenseSchema);










// // expenseModel.js

// const { DataTypes } = require('sequelize');
// const sequelize = require('../utils/data-config.js');
// const User = require('./user.js')

// const Expense = sequelize.define('Expense', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//       },
//   description: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   category: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   amount: {
//     type: DataTypes.FLOAT,
//     allowNull: false
//   }
// });
// User.hasMany(Expense, { foreignKey: 'userId' })
// Expense.belongsTo(User, { foreignKey: 'userId' });

// Expense.afterBulkDestroy(handleExpenseDestroy)

// async function handleExpenseDestroy(expense, options) {
//   console.log(expense)
//   const userId = expense.where.userId
//   const amount = expense.amount
//   let totalAmount = -(amount)

//   try {
//     const user = await User.findByPk(userId)
//     totalAmount += user.totalAmount

//     await user.update({ totalAmount })
//     console.log(`Total expense updated for user ${userId}`);
//   } catch (error) {
//     console.error('Error updating total expense:', error);
//     throw error
//   }
// };


// module.exports = Expense;