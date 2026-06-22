const express = require('express');
const { getDashboardStats, getActivityLogs } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', protect, authorize('admin', 'editor'), getDashboardStats);
router.get('/activity-logs', protect, authorize('admin'), getActivityLogs);

module.exports = router;
