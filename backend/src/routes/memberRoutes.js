const express = require('express');
const { getPublicMembers, getMemberProfile, updateMemberProfile } = require('../controllers/memberController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (will handle private visibility internally)
router.get('/', getPublicMembers);

// In order to properly inject req.user for checking self/admin on private profiles,
// we create an optional auth middleware wrapper or just handle it. 
// Since public profiles are viewable by anyone, we don't strictly enforce protect on GET /:id/profile,
// but we pass cookies to parse `req.user` inside `protect` without blocking.
// For simplicity as requested, we'll just check auth context dynamically or loosely block.
// Let's create a loose auth middleware inline for GET /:id/profile to attach req.user if token exists.

const optionalProtect = (req, res, next) => {
  const token = req.cookies.dsdl_token;
  if (token) {
    const jwt = require('jsonwebtoken');
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod');
    } catch (e) {
      // ignore
    }
  }
  next();
};

router.get('/:id/profile', optionalProtect, getMemberProfile);

// Authenticated routes
router.use(protect);
router.put('/:id/profile', updateMemberProfile);

module.exports = router;
