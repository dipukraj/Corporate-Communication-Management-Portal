const Magazine = require('../models/Magazine');
const { logActivity } = require('../utils/emailService');

// @desc    Create magazine
// @route   POST /api/magazine
const createMagazine = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
    }

    const { title, month, year, department, description } = req.body;

    const magazine = await Magazine.create({
      title,
      month,
      year: parseInt(year),
      department,
      pdfUrl: req.file.path,
      description,
      createdBy: req.user._id,
    });

    const populated = await Magazine.findById(magazine._id)
      .populate('department', 'name')
      .populate('createdBy', 'name email');

    await logActivity(
      req.user._id,
      'create_magazine',
      `Created magazine: ${title}`,
      'magazine',
      magazine._id
    );

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all magazines
// @route   GET /api/magazine
const getMagazines = async (req, res) => {
  try {
    const { search, department, year, month } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (department) query.department = department;
    if (year) query.year = parseInt(year);
    if (month) query.month = month;

    const magazines = await Magazine.find(query)
      .populate('department', 'name')
      .populate('createdBy', 'name email')
      .sort({ year: -1, createdAt: -1 });

    res.json({ success: true, count: magazines.length, data: magazines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete magazine
// @route   DELETE /api/magazine/:id
const deleteMagazine = async (req, res) => {
  try {
    const magazine = await Magazine.findById(req.params.id);
    if (!magazine) {
      return res.status(404).json({ success: false, message: 'Magazine not found' });
    }

    await logActivity(
      req.user._id,
      'delete_magazine',
      `Deleted magazine: ${magazine.title}`,
      'magazine',
      magazine._id
    );

    await magazine.deleteOne();
    res.json({ success: true, message: 'Magazine deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createMagazine, getMagazines, deleteMagazine };
