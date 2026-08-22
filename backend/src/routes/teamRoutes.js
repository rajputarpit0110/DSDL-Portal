const express = require('express');
const { 
  getAllTeams, getTeamById, createTeam, updateTeam, deleteTeam,
  requestToJoin, respondToRequest, getTeamRequests
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public Routes
router.get('/', getAllTeams);
router.get('/:id', getTeamById);

// Authenticated Actions
router.use(protect);
router.post('/:id/request-join', requestToJoin);

// Admin/Lead Routes (Secured internally by service for Lead ownership)
router.post('/', requireRole('admin', 'lead'), createTeam);
router.put('/:id', requireRole('admin', 'lead'), updateTeam);
router.get('/:id/requests', requireRole('admin', 'lead'), getTeamRequests);
router.patch('/:id/requests/:userId', requireRole('admin', 'lead'), respondToRequest);

// Admin ONLY
router.delete('/:id', requireRole('admin'), deleteTeam);

module.exports = router;
