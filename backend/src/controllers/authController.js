const authService = require('../services/authService');
const { generateTokenAndSetCookie } = require('../utils/generateToken');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const jwt = require('jsonwebtoken');

exports.register = asyncHandler(async (req, res) => {
  const safeUser = await authService.registerUser(req.body);
  
  // Check if caller is already an admin adding a user
  let callerIsAdmin = false;
  const token = req.cookies?.dsdl_token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod');
      if (decoded && decoded.role === 'admin') {
        callerIsAdmin = true;
      }
    } catch {
      // Ignored for unauthenticated users
    }
  }

  // Only auto-login if it is a self-registration (not admin creating an account)
  if (!callerIsAdmin) {
    generateTokenAndSetCookie(res, safeUser.id, safeUser.role);
  }

  res.status(201).json(new ApiResponse(201, 'User registered successfully', { user: safeUser }));
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const safeUser = await authService.loginUser(email, password);
  
  generateTokenAndSetCookie(res, safeUser.id, safeUser.role);

  res.status(200).json(new ApiResponse(200, 'Logged in successfully', { user: safeUser }));
});

exports.logout = asyncHandler(async (req, res) => {
  res.cookie('dsdl_token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json(new ApiResponse(200, 'Logged out successfully'));
});

exports.getMe = asyncHandler(async (req, res) => {
  const safeUser = await authService.getUserById(req.user.userId);
  res.status(200).json(new ApiResponse(200, 'Success', { user: safeUser }));
});
