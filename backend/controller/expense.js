const Expense = require('../model/expense.js')
const sequelize = require('../utils/data-config.js');
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
          t.commit()
          res.status(200).json(updatedExpense);
        } catch (error) {
          t.rollback()
          res.status(400).json({ message: error.message });
        }
    },

    delete :  async (req, res) => {
      const t = await sequelize.transaction()
        try {
          const {id} = req.body;
          const userId = req.user.id
          await Expense.destroy({ where: { id: id,  userId: userId }, transaction: t });
          t.commit()
          res.status(204).json({message: 'deleted successfully'});
        } catch (error) {
          t.rollback()
          res.status(400).json({ message: error.message });
        }
    },
}