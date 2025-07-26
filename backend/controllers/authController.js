const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get current user
exports.getMe = async (req, res) => {
  try {
    // The user ID is attached to the request by the auth middleware
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user data in the same format as login/register
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      // Add any other user fields you want to expose
    });
  } catch (err) {
    console.error('Get me error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role || 'user' // Default to 'user' if role not provided
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d' // Token expires in 7 days
    });

    // Return user data (without password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      // Add any other user fields you want to expose
    };

    res.status(201).json({ 
      success: true,
      token,
      user: userData 
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration' 
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d' // Token expires in 7 days
    });

    // Return user data (without password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      // Add any other user fields you want to expose
    };

    res.json({ 
      success: true,
      token,
      user: userData 
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};
