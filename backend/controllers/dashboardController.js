const User = require('../models/User');
const Department = require('../models/Department');
const Content = require('../models/Content');
const Magazine = require('../models/Magazine');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalDepartments, totalFiles, totalMagazines, recentUploads] =
      await Promise.all([
        User.countDocuments({ isActive: true }),
        Department.countDocuments({ isActive: true }),
        Content.countDocuments(),
        Magazine.countDocuments(),
        Content.find()
          .populate('uploadedBy', 'name')
          .populate('department', 'name')
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalDepartments,
        totalFiles,
        totalMagazines,
        recentUploads,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get activity logs
// @route   GET /api/dashboard/activity-logs
const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats, getActivityLogs };
