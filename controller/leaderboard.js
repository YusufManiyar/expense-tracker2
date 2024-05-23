const sequelize = require('sequelize')
const Expense = require('../model/expense.js')
const User = require('../model/user.js');
const expense = require('./expense.js');

module.exports = {
    fetch: async (req, res) => {
        try {
          const totalExpensesByUsers = await User.findAll(
            { attributes: ['id', 'username', 'totalAmount'],
          order: [['totalAmount', 'DESC']]
         });

          res.json(totalExpensesByUsers);
        } catch (error) {
          console.error('Error fetching leaderboard:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      }
}
