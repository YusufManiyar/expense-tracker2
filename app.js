require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');

const userRouter = require('./routes/user.js');
const passwordRouter = require('./routes/password.js');
const expenseRouter = require('./routes/expense.js');
const purchaseRouter = require('./routes/purchase.js');
const leaderboardRouter = require('./routes/leaderboard.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Security, performance, and body parsing middleware
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// CSP header
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "script-src 'self' *");
  next();
});

// API routes
app.use('/user', userRouter);
app.use('/password', passwordRouter);
app.use('/expense', expenseRouter);
app.use('/purchase', purchaseRouter);
app.use('/premium', leaderboardRouter);

// Serve static frontend
app.use(express.static(path.join(__dirname, './public/frontend')));

// MongoDB connection
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Failed to connect to DB:", err.message);
    throw err;
  }
};

// Start the server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error("Server failed to start:", error.message);
  }
};

startServer();




// // server.js
// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const path = require('path')
// const helmet = require('helmet');
// // const { sequelize, User } = require('./model/user.js');
// const userRouter = require('./routes/user.js')
// const passwordRouter = require('./routes/password.js')
// const expenseRouter = require('./routes/expense.js')
// const purchaseRouter = require('./routes/purchase.js')
// const leaderboardRouter = require('./routes/leaderboard.js')
// const compression = require('compression')
// const mongoose = require('mongoose');


// const app = express();
// const PORT = process.env.PORT || 3000;
// app.use(bodyParser.urlencoded({extended: false}))
// app.use(cors({
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));
// app.use(helmet());
// app.use(compression())
// app.use(express.json());

// // Routes
// app.use('/', userRouter);
// app.use('/password', passwordRouter);
// app.use('/', expenseRouter)
// app.use('/', purchaseRouter)

// // Route to fetch leaderboard data
// app.use('/premium', leaderboardRouter)

// app.use((req, res, next) => {
//   res.setHeader('Content-Security-Policy', "script-src 'self' *");
//   next();
// });

// app.use((req, res) => {
//   console.log(req.url)
//   res.sendFile(path.join(__dirname, `./public/frontend/${req.url}`))
// })

// const connectDB = async () => {
//     try {
//         mongoose.set("strictQuery", true);
//         await mongoose.connect(process.env.MONGODB_URL);
//         console.log("MongoDB Connected");
//     } catch (err) {
//         console.error("Failed to connect to DB");
//         throw err;
//     }
// };

// const startServer = async () => {
//     try {
//         await connectDB();
//         const PORT = process.env.PORT || 4000;
//         app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
//     } catch (error) {
//         console.error("Server failed to start:", error.message);
//     }
// };

// startServer();