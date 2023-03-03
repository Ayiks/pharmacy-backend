// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const db = require('../config/db');
// const { validationResult } = require('express-validator');
// require('dotenv/config')


// // POST /api/login
// exports.login = async (req, res) => {
//   // Check for validation errors
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).json({ errors: errors.array() });
//   }

//   // Extract email and password from request body
//   const { email, password } = req.body;

//   try {
//     // Check if user exists in the database
//     const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
//     const user = rows[0];
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     // Check if password is correct
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     // Create a new JWT token with the user ID as payload
//     const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET);

//     // Send the JWT token back to the client
//     return res.json({ token });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const dotenv = require('dotenv');
dotenv.config();

exports.login = async (req, res) => {
  try {
    const { email, password, permission } = req.body;

    // Get user from database
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check if user has required permission
    if (user.permissions && user.permissions.includes(permission)) {
      // Generate token
      const token = jwt.sign({ userId: user._id, email: user.email, permissions: user.permissions }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ message: 'Authentication successful.', token });
    } else {
      return res.status(401).json({ message: 'Unauthorized.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while logging in.', error });
  }
};

// module.exports = login;
