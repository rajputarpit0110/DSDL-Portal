const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/', achievementController.getAllAchievements);
router.post('/', protect, requireRole('lead', 'admin'), achievementController.createAchievement);
router.delete('/:id', protect, requireRole('lead', 'admin'), achievementController.deleteAchievement);

module.exports = router;
