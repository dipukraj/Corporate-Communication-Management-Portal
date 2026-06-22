const Content = require('../models/Content');
const { sendUploadNotification, logActivity } = require('../utils/emailService');

// @desc    Upload content
// @route   POST /api/content/upload
const uploadContent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { title, description, category, department, date, status } = req.body;

    const content = await Content.create({
      title,
      description,
      category,
      department: department || req.user.department?._id,
      fileUrl: req.file.path,
      fileType: req.file.mimetype,
      fileName: req.file.originalname,
      uploadedBy: req.user._id,
      date: date || Date.now(),
      status: status || 'published',
    });

    const populated = await Content.findById(content._id)
      .populate('uploadedBy', 'name email')
      .populate('department', 'name');

    await logActivity(
      req.user._id,
      'upload_content',
      `Uploaded: ${title}`,
      'content',
      content._id
    );

    await sendUploadNotification(req.user, content);

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all content with search & filter
// @route   GET /api/content
const getContent = async (req, res) => {
  try {
    const { search, department, category, year, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (department) query.department = department;
    if (category) query.category = category;
    if (status) query.status = status;

    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31T23:59:59`);
      query.date = { $gte: startDate, $lte: endDate };
    }

    if (req.user.role === 'department_user' && req.user.department) {
      query.department = req.user.department._id;
    }

    const content = await Content.find(query)
      .populate('uploadedBy', 'name email')
      .populate('department', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: content.length, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single content
// @route   GET /api/content/:id
const getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('uploadedBy', 'name email')
      .populate('department', 'name');

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete content
// @route   DELETE /api/content/:id
const deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    if (
      req.user.role === 'department_user' &&
      content.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this content' });
    }

    await logActivity(
      req.user._id,
      'delete_content',
      `Deleted: ${content.title}`,
      'content',
      content._id
    );

    await content.deleteOne();
    res.json({ success: true, message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadContent, getContent, getContentById, deleteContent };
