const { Op } = require('sequelize');
const Expense = require('../model/expense.js')
const User = require('../model/user.js')
const sequelize = require('../utils/data-config.js');
const AWS = require('aws-sdk');
const DownloadRequest = require('../model/downloadRequest.js');
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

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
            const query = req.query
            const matchParams = {
              userId
            }

            let dateFilter = {}
            if(query.startDate !== undefined) {
              dateFilter[Op.gte] = new Date(query.startDate + 'T00:00:00.000Z')
              matchParams.createdAt = dateFilter
            }

            if(query.endDate !== undefined) {
              dateFilter[Op.lte] = new Date(query.endDate + 'T23:59:59.999Z')
              matchParams.createdAt = dateFilter
            }
            const expenses = await Expense.findAll({
                where: matchParams
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

    downloadCSV : async (req, res) => {
      try {
          const userId = req.user.id
          const query = req.query

          const matchParams = {
            userId
          }

          let dateFilter = {}
          if(query.startDate !== undefined) {
            dateFilter[Op.gte] = new Date(query.startDate + 'T00:00:00.000Z')
            matchParams.createdAt = dateFilter
          }

          if(query.endDate !== undefined) {
            dateFilter[Op.lte] = new Date(query.endDate + 'T23:59:59.999Z')
            matchParams.createdAt = dateFilter
          }

          const expenses = await Expense.findAll({
              where: matchParams
          });

          const url = await saveCsv(expenses)

          res.status(200).json({file : url});
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  },
}

async function saveCsv(expenses) {
  try {

  var csvContent = "description,category,amount,createdAt\n";

// Append data rows
let totalExpense=0, totalIncome=0
  expenses.forEach(function(expense) {
    expense.category === 'Income' ? totalIncome += expense.amount : totalExpense += expense.amount
    var row = `${expense.description},${expense.category},${expense.amount},${expense.createdAt.toDateString().split('T')[0]}\n`;
    csvContent += row;
  });

  let savings = totalIncome - totalExpense
  csvContent += `\n\n\n\nTotal Expense,${totalExpense}\nTotal Income,${totalIncome}\nTotal Savings,${savings}\n`

  let filename = `expense${expenses[0].userId}_${new Date().toDateString()}.csv`
  const uploadParams = {
    Bucket: 'user-expense-data1',
    Key: filename,
    Body: csvContent,
    ACL: 'public-read'
  };

  // Upload the file to S3
  const data = await s3.upload(uploadParams).promise()
  console.log(data)
  await DownloadRequest.create({name: filename, fileUrl: data.Location, userId: expenses[0]?.userId})
  return data.Location
  }
  catch(error) {
    console.log(error)
  }
}