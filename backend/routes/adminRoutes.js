const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes here require admin role
router.use(protect);
router.use(requireRole('admin'));

router.get('/test', (req, res) => {
  res.status(200).json({ success: true, message: 'Admin access granted' });
});

module.exports = router;
