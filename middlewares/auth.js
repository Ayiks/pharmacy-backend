// const jwt = require('jsonwebtoken');
// require('dotenv/config');

// const auth = (req, res, next) => {
//     // Get the token from the Authorization header
//     const token = req.header('Authorization');
  
//     // Check if token exists
//     if (!token) {
//       return res.status(401).json({ message: 'Authorization denied. No token provided.' });
//     }
  
//     try {
//       // Verify the token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
//       // Set the user ID on the request object
//       req.userId = decoded.userId;
  
//       // Call the next middleware function
//       next();
//     } catch (err) {
//       res.status(401).json({ message: 'Authorization denied. Invalid token.' });
//     }
//   };
  
//   module.exports = auth;
  
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
    if (req.userData.permissions && req.userData.permissions.indexOf('admin') !== -1) {
      next();
    } else {
      return res.status(401).json({ message: 'Authorization denied. Insufficient permissions.' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Authorization denied. Invalid token.' });
  }
};

module.exports = authMiddleware;
