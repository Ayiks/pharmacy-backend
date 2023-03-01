const jwt = require('jsonwebtoken');
require('dotenv/config');

const auth = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.header('Authorization');
  
    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'Authorization denied. No token provided.' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Set the user ID on the request object
      req.userId = decoded.userId;
  
      // Call the next middleware function
      next();
    } catch (err) {
      res.status(401).json({ message: 'Authorization denied. Invalid token.' });
    }
  };
  
  module.exports = auth;
  