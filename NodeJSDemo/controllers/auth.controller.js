const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { JWT_SECRET_KEY } = require('../config/config');
const nodemailer = require('nodemailer'); // For sending emails

async function sendResetEmail(email, token) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  // Correct Gmail SMTP server
    port: 587,  
    auth: {
      user: process.env.EMAIL_USER, // Your email address/ Your Elastic Email API Key
      pass: process.env.EMAIL_PASS, // Your email password (or app password)/ Your Elastic Email API Key
    },
    // Optional: Set connection and send timeouts (in ms)
    connectionTimeout: 600000,
    greetingTimeout: 600000,
    sendTimeout: 600000,
    tls: {
      rejectUnauthorized: false  // Optional: Helps bypass certain SSL/TLS issues (e.g., internal networks)
    },
    debug: true, 
    logger: true,
  });

  const resetLink = `http://localhost:3000/reset-password/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
}

// Register User
const registerUser = async (req, res) => {
  const { name, mobileNo, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    // Create a new user
    const newUser = new User({
      name,
      mobileNo,
      email,
      password: password,
    });

    // Save user to MongoDB
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      JWT_SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign up.' });
    }

    // Compare password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    // Log the user ID to verify it's coming from the token
    console.log('Fetching user profile for user ID:', req.user._id);

    const user = await User.findById(req.user._id);

    if (!user) {
      console.log('User not found in the database.');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User profile found:', user); // Log the user data fetched from the DB

    res.status(200).json({
      message: 'User profile fetched successfully',
      data: {
        name: user.name,
        email: user.email,
        mobileNo: user.mobileNo,
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error); // Log server-side errors
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};


/// Update User Profile (name, password)
const updateProfile = async (req, res) => {
  const { name, oldPassword, newPassword } = req.body;

  try {
    // Fetch the user using the ID from the JWT token (req.user.id)
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If both name and password are provided, validate the old password for the password update
    if (oldPassword && newPassword) {
      if (user.password !== oldPassword) {
        return res.status(401).json({ message: 'Old password is incorrect' });
      }
      user.password = newPassword; // Update the password
    }

    // Update the name if provided
    if (name) {
      user.name = name;
    }

    // Save the updated user profile
    await user.save();

    res.status(200).json({
      message: 'User profile updated successfully',
      data: {
        name: user.name,
        email: user.email,
        mobileNo: user.mobileNo,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile', error });
  }
};


// Delete User Profile
const deleteProfile = async (req, res) => {
  try {
    // Use the user ID from req.user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user profile
    await user.deleteOne();

    res.status(200).json({ message: 'User profile deleted successfully' });
  } catch (error) {
    console.error("Error during deletion:", error);
    res.status(500).json({ message: 'Error deleting profile', error });
  }
};


// Forgot Password (send reset email)
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a password reset token (valid for 1 hour)
    const resetToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET_KEY, { expiresIn: '1h' });

    // Send the password reset email
    sendResetEmail(email, resetToken);

    res.status(200).json({ message: 'Password reset link sent to email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending reset email', error });
  }
};



// Reset Password (using reset token)
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    // Find the user by ID from the decoded token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid or expired token', error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateProfile,
  deleteProfile,
  sendResetEmail,
};
