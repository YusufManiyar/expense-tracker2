// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize, User } = require('./model/user.js');
const userRoute = require('./routes/user.js')
const expenseRouter = require('./routes/expense.js')
const purchaseRouter = require('./routes/purchase.js')


const app = express();
const PORT = process.env.PORT || 4000;
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
app.use('/', userRoute);
app.use('/', expenseRouter)
app.use('/', purchaseRouter)

// Start server
sequelize.sync({focus: true}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
