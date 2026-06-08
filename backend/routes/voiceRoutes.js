const express = require('express');
const router = express.Router();
const { logVoiceCommand, getVoiceCommandLogs } = require('../controllers/voiceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/log', logVoiceCommand);
router.get('/logs', authorize('admin'), getVoiceCommandLogs);

module.exports = router;
