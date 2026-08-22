const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// Handle single file upload in the 'file' field
router.post('/', protect, upload.single('file'), uploadController.uploadFile);

module.exports = router;
