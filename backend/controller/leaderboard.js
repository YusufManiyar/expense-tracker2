const Expense = require('../model/expense.js')
const User = require('../model/user.js');

module.exports = {
    fetch: async (req, res) => {
        try {
          const expenses = await Expense.findAll({ include: User }); // Fetch all expenses with associated user
          // console.log(expenses)
          const leaderboard = {};
      
          // Calculate total expenses for each user
          expenses.forEach((expense) => {
            const userId = expense.User.id;
            const userName = expense.User.username;
            const amount = expense.amount;
            // console.log("user", userId, userName, amount)
      
            if (!leaderboard[userId]) {
              leaderboard[userId] = {
                name: userName,
                totalExpense: 0,
              };
            }
      
            leaderboard[userId].totalExpense += amount;
          });
      
          // Convert leaderboard object to an array for sorting
          const sortedLeaderboard = Object.values(leaderboard).sort((a, b) => a.totalExpense - b.totalExpense);
      
          res.json(sortedLeaderboard);
        } catch (error) {
          console.error('Error fetching leaderboard:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      }
}
