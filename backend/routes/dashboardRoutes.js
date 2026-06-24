const express = require('express');
const { getDashboardStats, getActivityLogs } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', protect, getDashboardStats);
router.get('/activity-logs', protect, getActivityLogs);

module.exports = router;
