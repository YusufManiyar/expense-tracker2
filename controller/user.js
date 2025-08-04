const User = require('../model/user.js');
const bcrypt = require('bcrypt');
const DownloadRequest = require('../model/downloadRequest.js');

// Function to hash a password
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Error hashing password');
  }
}

module.exports = {
  signup: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.find({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await hashPassword(password);

      const newUser = new User({
        username,
        email,
        password: hashedPassword
      });

      await newUser.save();

      req.body = { id: newUser._id, ispremiumactive: newUser.ispremiumactive };
      next();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      req.body = { id: user._id, ispremiumactive: user.ispremiumactive };
      next();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getDownloadLogs: async (req, res) => {
    try {
      const userId = req.user.id; // assuming req.user is set by auth middleware
      const logs = await DownloadRequest.find({ user: userId }).sort({ createdAt: -1 });
      res.status(200).json(logs);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};









// const User = require('../model/user.js');
// const jwt = require('jsonwebtoken')

// const bcrypt = require('bcrypt');
// const DownloadRequest = require('../model/downloadRequest.js');

// // Function to hash a password
// async function hashPassword(password) {
//   try {
//     // Generate a salt
//     const salt = await bcrypt.genSalt(10);
//     // Hash the password with the salt
//     const hashedPassword = await bcrypt.hash(password, salt);
//     return hashedPassword;
//   } catch (error) {
//     throw new Error('Error hashing password');
//   }
// }


// module.exports = {
//     signup : async (req, res, next) => {
//         try {
//           const { username, email, password } = req.body;
//           const hashPass = await hashPassword(password)
//           const newUser = await User.create({ username, email, password: hashPass });
          
//           req.body = {id: newUser.id, ispremiumactive:newUser.ispremiumactive}
//           next()
//         } catch (error) {
//           res.status(400).json({ message: error.errors && error.errors.length > 0 ? error.errors[0].message : error.toString()});
//         }
//       },

//     login : async (req, res, next) => {
//         try {
//           const { email, password } = req.body;
//           const user = await User.findOne({ where: { email } });
//           let match = false
//           if(user){
//             match = await bcrypt.compare(password, user.password)
//           }
          
//           if (match) {
//             // Successful login
//             req.body = {id: user.id, ispremiumactive: user.ispremiumactive}
//             next()
//           } else {
//             // Invalid credentials
//             res.status(401).json({ message: 'Invalid email or password' });
//           }
//         } catch (error) {
//           res.status(400).json({ message: error.message });
//         }
//     },

//     getDownloadLogs: async (req, res, next) => {
//       try {
//         const downloadRequestLogs = await DownloadRequest.findAll({where : {userId : req.user.id}})
//         res.status(200).json(downloadRequestLogs)
//       } catch (error) {
//         res.status(400).json({ message: error.toString() });
//       }
//   },
// }