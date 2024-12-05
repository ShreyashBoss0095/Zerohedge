const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../config/config');

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.header('Authorization')?.split(' ')[1];

  // Log the token for debugging (this will show in your server terminal)
  console.log('Authorization Header:', req.header('Authorization'));
  console.log('Extracted Token:', token);

  // If token is not provided, return a "Forbidden" response
  if (!token) {
    console.log('No token provided'); // Log no token
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    // Log errors for debugging
    if (err) {
      console.log('JWT Verification Error:', err);

      // If there's an error in verification (invalid token or expired)
      if (err.name === 'TokenExpiredError') {
        console.log('Token has expired');
        return res.status(401).json({ message: 'Token has expired. Please log in again.' });
      }
      console.log('Invalid token');
      return res.status(403).json({ message: 'Invalid token.' });
    }

    // If token is valid, log the decoded payload
    console.log('Decoded JWT Payload:', decoded); // Log the decoded payload

    // Attach the decoded user info to the request object
    req.user = { _id: decoded.id };  // Map 'id' from the JWT payload to 'req.user._id'
    console.log('Decoded user info:', req.user); 

    // Call the next middleware or route handler
    next();
  });
};


module.exports = { authenticateToken };
