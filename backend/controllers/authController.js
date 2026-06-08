const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ActivityLog = require('../models/activityLogModel');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'aura_voice_media_jwt_secret_key_987654321_abc', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Determine role. If first user in DB, make Admin. Otherwise use request role or default viewer
    const userCount = await User.count();
    let finalRole = role || 'viewer';
    if (userCount === 0) {
      finalRole = 'admin';
    }

    const user = await User.create({
      username,
      email,
      password,
      role: finalRole,
      profileImage: req.body.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${username}`,
    });

    if (user) {
      // Log Registration Activity
      await ActivityLog.create({
        userId: user.id,
        action: 'Register',
        details: `User registered with email: ${email} and role: ${finalRole}`,
        ipAddress: req.ip || '',
        userAgent: req.headers['user-agent'] || ''
      });

      res.status(201).json({
        success: true,
        _id: user.id, // Map both _id and id for frontend compatibility
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
      // Log Login Activity
      await ActivityLog.create({
        userId: user.id,
        action: 'Login',
        details: `User logged in from IP ${req.ip}`,
        ipAddress: req.ip || '',
        userAgent: req.headers['user-agent'] || ''
      });

      res.json({
        success: true,
        _id: user.id, // Map both _id and id for frontend compatibility
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token: generateToken(user.id),
      });
    } else {
      // Log Failed Attempt if user found
      if (user) {
        await ActivityLog.create({
          userId: user.id,
          action: 'Failed Login',
          details: 'Attempted login with incorrect password',
          ipAddress: req.ip || '',
          userAgent: req.headers['user-agent'] || ''
        });
      }
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  try {
    if (req.user) {
      await ActivityLog.create({
        userId: req.user.id,
        action: 'Logout',
        details: `User logged out`,
        ipAddress: req.ip || '',
        userAgent: req.headers['user-agent'] || ''
      });
    }
    res.json({ success: true, message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      res.json({
        success: true,
        _id: user.id, // Map both _id and id
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password Request
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Email address not registered' });
    }

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'aura_voice_media_jwt_secret_key_987654321_abc', { expiresIn: '15m' });
    const resetUrl = `/reset-password/${resetToken}`;

    res.json({
      success: true,
      message: 'Demo Password Reset link generated. In production, this goes to email.',
      resetUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Reset token is required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'aura_voice_media_jwt_secret_key_987654321_abc');
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = password;
    await user.save();

    await ActivityLog.create({
      userId: user.id,
      action: 'Reset Password',
      details: 'Password was successfully reset',
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    res.json({ success: true, message: 'Password has been reset successfully. You can now login.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
};
