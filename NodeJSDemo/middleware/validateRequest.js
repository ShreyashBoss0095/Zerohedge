//use libraries like express-validator to validate incoming requests. 
// middleware/validateRequest.js

const { check, validationResult } = require('express-validator');

// Request validation for login
const validateLogin = [
  // Validate email
  check('email')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(), // Normalize the email
  
  // Validate password (must be present)
  check('password')
    .exists().withMessage('Password is required')
    .notEmpty().withMessage('Password cannot be empty'),
];


// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateLogin,
  handleValidationErrors,
};
