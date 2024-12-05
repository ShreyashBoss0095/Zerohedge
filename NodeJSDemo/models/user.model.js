const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
const { JWT_SECRET_KEY } = require('../config/config'); // Assuming your secret key is in config file



// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensures that the name is unique
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures that the email is unique
    lowercase: true,
  },
  mobileNo: {  
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Fields for password reset functionality
  resetPasswordToken: {
    type: String,
    default: null, // Will hold the reset token if requested
  },
  resetPasswordExpires: {
    type: Date,
    default: null, // Will hold the expiration time of the reset token
  },
});


// Compare password with the input password
userSchema.methods.comparePassword = function(password) {
  return password === this.password; // Just a plain string comparison
};

// Method to update the user profile (name, email, and password)
userSchema.methods.updateProfile = async function(name, password) {
  if (name) this.name = name; // Update name if provided
  if (password) this.password = password; // Directly set the new password as a string

  await this.save(); // Save updated user
  return this;
};

// Method to generate a password reset token and expiration date
userSchema.methods.generateResetToken = function () {
  // Create a reset token (using the user's id and email, for example)
  const token = jwt.sign(
    { id: this._id, email: this.email },
    JWT_SECRET_KEY,  // Use your secret key to sign the token
    { expiresIn: '1h' }  // Token will expire in 1 hour
  );

  // Set the reset token and expiration date
  this.resetPasswordToken = token;
  this.resetPasswordExpires = Date.now() + 3600000;  // 1 hour expiration
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
