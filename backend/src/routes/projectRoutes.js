const express = require('express');
const { 
  getAllProjects, getProjectById, createProject, 
  updateProject, deleteProject 
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public Routes
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

// Authenticated User Routes (Members can submit projects)
router.use(protect);
router.post('/', createProject);
router.put('/:id', updateProject); // Security handled inside the service

// Admin ONLY Routes
router.delete('/:id', requireRole('admin'), deleteProject);

module.exports = router;
