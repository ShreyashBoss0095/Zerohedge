const express = require('express');
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateProfile,
  deleteProfile
} = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware'); 
const { validateLogin, handleValidationErrors } = require('../middleware/validateRequest')
const { check } = require('express-validator');


const router = express.Router();

// User registration route
router.post('/register', registerUser);

// User login route
router.post('/login', loginUser, validateLogin, handleValidationErrors,);

// Forgot password (sends reset email)
router.post('/forgot-password', forgotPassword);

// Reset password (user must provide reset token)
router.post('/reset-password/:token', resetPassword);

// Route to get user profile (requires user authentication)
router.get('/user-profile', authenticateToken, getUserProfile);

// Route to update user profile (name, password) (requires user authentication)
//router.put('/update-profile', authenticateToken, updateProfile);
router.put('/update-profile', authenticateToken, updateProfile, [
  check('name').notEmpty().withMessage('Name is required'),
  check('oldPassword').isLength({ min: 6 }).withMessage('Current password should be at least 6 characters'),
  check('newPassword').optional().isLength({ min: 6 }).withMessage('New password should be at least 6 characters'),
  handleValidationErrors  // Middleware to handle validation errors
],);

// Route to delete user profile (requires user authentication)
router.delete('/delete-profile', authenticateToken, deleteProfile);

module.exports = router;
