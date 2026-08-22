const express = require('express');
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const domainRoutes = require('./domainRoutes');
const memberRoutes = require('./memberRoutes');
const eventRoutes = require('./eventRoutes');
const announcementRoutes = require('./announcementRoutes');
const projectRoutes = require('./projectRoutes');
const teamRoutes = require('./teamRoutes');
const achievementRoutes = require('./achievementRoutes');
const uploadRoutes = require('./uploadRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/domains', domainRoutes);
router.use('/members', memberRoutes);
router.use('/events', eventRoutes);
router.use('/announcements', announcementRoutes);
router.use('/projects', projectRoutes);
router.use('/teams', teamRoutes);
router.use('/achievements', achievementRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
