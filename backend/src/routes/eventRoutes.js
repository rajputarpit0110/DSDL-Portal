const express = require('express');
const { 
  getAllEvents, getEventById, createEvent, updateEvent, 
  deleteEvent, publishEvent, registerForEvent, getEventRegistrations 
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Optional protect middleware to identify admins requesting all events
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
router.get('/', optionalProtect, getAllEvents);
router.get('/:id', getEventById);

// Authenticated Routes
router.use(protect);
router.post('/:id/register', registerForEvent);

// Admin-only Routes
router.use(requireRole('admin'));
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.patch('/:id/publish', publishEvent);
router.get('/:id/registrations', getEventRegistrations);

module.exports = router;
