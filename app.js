// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')
const helmet = require('helmet');
const { sequelize, User } = require('./model/user.js');
const userRouter = require('./routes/user.js')
const passwordRouter = require('./routes/password.js')
const expenseRouter = require('./routes/expense.js')
const purchaseRouter = require('./routes/purchase.js')
const leaderboardRouter = require('./routes/leaderboard.js')
const compression = require('compression')


const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet());
app.use(compression())
app.use(express.json());

// Routes
app.use('/', userRouter);
app.use('/password', passwordRouter);
app.use('/', expenseRouter)
app.use('/', purchaseRouter)

// Route to fetch leaderboard data
app.use('/premium', leaderboardRouter)

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "script-src 'self' *");
  next();
});

app.use((req, res) => {
  console.log(req.url)
  res.sendFile(path.join(__dirname, `./public/frontend/${req.url}`))
})

// Start server
sequelize.sync({focus: true}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
