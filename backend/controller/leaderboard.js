const sequelize = require('sequelize')
const Expense = require('../model/expense.js')
const User = require('../model/user.js')

module.exports = {
    fetch: async (req, res) => {
        try {
          const totalExpensesByUsers = await Expense.findAll({ include: [
            {
              model: User,
              attributes: ['username']
            }
          ],
            attributes: [
            [sequelize.fn('SUM', sequelize.col('amount')), 'totalExpense']
          ],
          group: ['UserId'], // Group expenses by UserId
          raw: true
         });

          // Convert leaderboard object to an array for sorting
          const sortedLeaderboard = totalExpensesByUsers.sort((a, b) => b.totalExpense - a.totalExpense);
      
          res.json(sortedLeaderboard);
        } catch (error) {
          console.error('Error fetching leaderboard:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      }
}
