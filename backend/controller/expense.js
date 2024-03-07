const Expense = require('../model/expense.js')

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
        try {
            const { description, category, amount } = req.body;
            const userId = req.user.id
            const newExpense = await Expense.create({userId, description, category, amount });
            res.status(201).json(newExpense);
        } catch (error) {
          console.log(error)
            res.status(400).json({ message: error.message });
        }
    },

    update : async (req, res) => {
        try {

          const { id, description,category, amount } = req.body;
          await Expense.update({ description,category, amount }, { where: { id: id } });
          const updatedExpense = await Expense.findByPk(id);
          res.status(200).json(updatedExpense);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
    },

    delete :  async (req, res) => {
        try {
          const {id} = req.body;
          const userId = req.user.id
          await Expense.destroy({ where: { id: id,  userId: userId } });
          res.status(204).json({message: 'deleted successfully'});
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
    },
}