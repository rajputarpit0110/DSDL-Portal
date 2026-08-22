const express = require('express');
const { getAllDomains, getDomainById, createDomain, updateDomain, deleteDomain } = require('../controllers/domainController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllDomains);
router.get('/:id', getDomainById);

// Admin-only routes
router.use(protect);
router.use(requireRole('admin'));

router.post('/', createDomain);
router.put('/:id', updateDomain);
router.delete('/:id', deleteDomain);

module.exports = router;
