// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize, User } = require('./model/user.js');
const userRouter = require('./routes/user.js')
const passwordRouter = require('./routes/password.js')
const expenseRouter = require('./routes/expense.js')
const purchaseRouter = require('./routes/purchase.js')
const leaderboardRouter = require('./routes/leaderboard.js')


const app = express();
const PORT = process.env.PORT || 4000;
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet());
app.use(express.json());

// Routes
app.use('/', userRouter);
app.use('/password', passwordRouter);
app.use('/', expenseRouter)
app.use('/', purchaseRouter)

// Route to fetch leaderboard data
app.use('/premium', leaderboardRouter)

// Start server
sequelize.sync({focus: true}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
