const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET_KEY } = require('../config/config.js');

// Generate JWT token (for login and registration)
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET_KEY, {
    expiresIn: '2h',
  });
};

// Generate a password reset token (used for "Forgot Password" functionality)
const generateResetToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET_KEY,
    { expiresIn: '1h' }  // Token expiration set to 1 hour
  );
};

// Verify the reset token (to check if it's valid and not expired)
const verifyResetToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  generateToken,
  generateResetToken,
  verifyResetToken,
};
