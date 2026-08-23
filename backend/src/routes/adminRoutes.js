const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');
const ApiResponse = require('../utils/apiResponse');

const router = express.Router();

router.use(protect);
router.use(requireRole('admin'));

router.get('/test', (req, res) => {
  res.status(200).json(new ApiResponse(200, 'Admin access granted'));
});

router.get('/stats', adminController.getStats);
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/reports/export', adminController.exportReport);

module.exports = router;
