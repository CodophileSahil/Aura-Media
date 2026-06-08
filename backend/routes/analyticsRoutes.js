const express = require('express');
const router = express.Router();
const { getDashboardAnalytics, getSystemLogs } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/dashboard', getDashboardAnalytics);
router.get('/logs', authorize('admin'), getSystemLogs);

module.exports = router;
