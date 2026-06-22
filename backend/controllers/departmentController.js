const Department = require('../models/Department');
const { logActivity } = require('../utils/emailService');

// @desc    Get all departments
// @route   GET /api/departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true });
    res.json({ success: true, count: departments.length, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create department
// @route   POST /api/departments
const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    const department = await Department.create({ name, description });

    await logActivity(
      req.user._id,
      'create_department',
      `Created department: ${name}`,
      'department',
      department._id
    );

    res.status(201).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    await logActivity(
      req.user._id,
      'update_department',
      `Updated department: ${department.name}`,
      'department',
      department._id
    );

    res.json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    await logActivity(
      req.user._id,
      'delete_department',
      `Deleted department: ${department.name}`,
      'department',
      department._id
    );

    await department.deleteOne();
    res.json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDepartments, createDepartment, updateDepartment, deleteDepartment };
