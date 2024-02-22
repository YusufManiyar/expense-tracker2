// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize, User } = require('./models');

const app = express();
const PORT = process.env.PORT || 4000;
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors());
app.use(express.json());

// Routes
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('req', req)
    const newUser = await User.create({ username, email, password });
    console.log("user",newUser)
    res.json({ message: 'Sign up successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
