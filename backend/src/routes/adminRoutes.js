const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const ApiResponse = require('../utils/apiResponse');

const router = express.Router();

// All routes here require admin role
router.use(protect);
router.use(requireRole('admin'));

router.get('/test', (req, res) => {
  res.status(200).json(new ApiResponse(200, 'Admin access granted'));
});

module.exports = router;
