const User = require('../model/user.js');

module.exports = {
    signup : async (req, res) => {
        try {
          const { username, email, password } = req.body;
          const newUser = await User.create({ username, email, password });
          res.status(201).json(newUser);
          // res.status(201).json({message: "User Successfully Created"})
        } catch (error) {
            // console.log("error", error)
          res.status(400).json({ message: error.errors && error.errors.length > 0 ? error.errors[0].message : error.toString()});
        }
      },

    login : async (req, res) => {
        try {
          const { email, password } = req.body;
          const user = await User.findOne({ where: { email, password } });
          if (user) {
            // Successful login
            res.status(200).json(user);
          } else {
            // Invalid credentials
            res.status(401).json({ message: 'Invalid email or password' });
          }
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
    },
}