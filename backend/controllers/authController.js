const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const { generateTokenAndSetCookie } = require('../utils/jwt');

exports.register = async (req, res) => {
  try {
    const { name, email, password, enrollmentNumber, branch, year } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      name,
      email,
      password_hash,
      enrollment_number: enrollmentNumber,
      branch,
      year,
      role: 'member' // Hardcode member role for all registrations
    });

    generateTokenAndSetCookie(res, newUser.id, newUser.role);

    const { password_hash: _, ...safeUser } = newUser;
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: safeUser
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    generateTokenAndSetCookie(res, user.id, user.role);

    const { password_hash: _, ...safeUser } = user;

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: safeUser
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

exports.logout = (req, res) => {
  res.cookie('dsdl_token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { password_hash: _, ...safeUser } = user;
    res.status(200).json({
      success: true,
      user: safeUser
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
