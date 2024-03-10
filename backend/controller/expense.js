const { Op } = require('sequelize');
const Expense = require('../model/expense.js')
const User = require('../model/user.js')
const sequelize = require('../utils/data-config.js');

async function handleExpenseChange(id, userId, amount, t) {

  let totalAmount = amount

  try {
    const user = await User.findByPk(userId)

    totalAmount += await Expense.sum('amount', { where: { userId, id: { [Op.ne]: id } } }) || 0
    await user.update({ totalAmount }, { transaction: t })
    console.log(`Total expense updated for user ${userId}`);
  } catch (error) {
    console.error('Error updating total expense:', error);
    throw error
  }
};

module.exports = {
    fetch : async (req, res) => {
        try {
            const userId = req.user.id
            const expenses = await Expense.findAll({
                where: {
                  userId: userId
                }
              });
            res.status(200).json({expenses: expenses, isPremiumActive: req.user.ispremiumactive});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    add :async (req, res) => {
      const t = await sequelize.transaction()
        try {
            const { description, category, amount } = req.body;
            const userId = req.user.id
            const newExpense = await Expense.create({userId, description, category, amount }, {transaction: t});
            await handleExpenseChange(null, userId, amount, t)
            t.commit()
            res.status(201).json(newExpense);
        } catch (error) {
          console.log(error)
          t.rollback()
          res.status(400).json({ message: error.message });
        }
    },

    update : async (req, res) => {
      const t = await sequelize.transaction()
        try {
          const { id, description,category, amount } = req.body;
          const userId = req.user.id
          await Expense.update({ description,category, amount }, { where: { id: id, userId: userId }, transaction: t });
          const updatedExpense = await Expense.findByPk(id, { transaction: t });
          await handleExpenseChange(id, userId, amount, t)
          t.commit()
          res.status(200).json(updatedExpense);
        } catch (error) {
          console.log(error)
          t.rollback()
          res.status(400).json({ message: error.message });
        }
    },

    delete :  async (req, res) => {
      const t = await sequelize.transaction()
        try {
          const {id} = req.body;
          const userId = req.user.id
          await Expense.destroy({ where: { id: id,  userId: userId }, transaction: t })
          t.commit()
          res.status(204).json({message: 'deleted successfully'});
        } catch (error) {
          t.rollback()
          res.status(400).json({ message: error.message });
        }
    },
}