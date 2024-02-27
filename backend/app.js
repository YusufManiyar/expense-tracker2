// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize, User } = require('./model/user.js');
const userRoute = require('./routes/user.js')
const expenseRouter = require('./routes/expense.js')

const app = express();
const PORT = process.env.PORT || 4000;
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors());
app.use(express.json());

// Routes
app.use('/', userRoute);
app.use('/', expenseRouter)

// Start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
