const User = require('../model/user.js');
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt');

// Function to hash a password
async function hashPassword(password) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
}


module.exports = {
    signup : async (req, res, next) => {
        try {
          const { username, email, password } = req.body;
          const hashPass = await hashPassword(password)
          const newUser = await User.create({ username, email, password: hashPass });

          req.body = {id: newUser.id, ispremiumactive:newUser.ispremiumactive}
          next()
        } catch (error) {
          res.status(400).json({ message: error.errors && error.errors.length > 0 ? error.errors[0].message : error.toString()});
        }
      },

    login : async (req, res, next) => {
        try {
          const { email, password } = req.body;
          const user = await User.findOne({ where: { email } });
          let match = false
          if(user){
            match = await bcrypt.compare(password, user.password)
          }
          
          if (match) {
            // Successful login
            req.body = {id: user.id, ispremiumactive: user.ispremiumactive}
            // res.json(user)
            next()
          } else {
            // Invalid credentials
            res.status(401).json({ message: 'Invalid email or password' });
          }
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
    },
}