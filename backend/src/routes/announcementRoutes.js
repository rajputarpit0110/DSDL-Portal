const express = require('express');
const { 
  getAnnouncements, getAnnouncementById, createAnnouncement, 
  updateAnnouncement, deleteAnnouncement, publishAnnouncement 
} = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

const optionalProtect = (req, res, next) => {
  const token = req.cookies.dsdl_token;
  if (token) {
    const jwt = require('jsonwebtoken');
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod');
    } catch (e) {}
  }
  next();
};

// Public Routes
router.get('/', optionalProtect, getAnnouncements);
router.get('/:id', getAnnouncementById);

// Admin & Lead Routes
router.use(protect);

router.post('/', requireRole('admin', 'lead'), createAnnouncement);
router.put('/:id', requireRole('admin', 'lead'), updateAnnouncement);
router.patch('/:id/publish', requireRole('admin', 'lead'), publishAnnouncement);

// Admin ONLY Routes
router.delete('/:id', requireRole('admin'), deleteAnnouncement);

module.exports = router;
