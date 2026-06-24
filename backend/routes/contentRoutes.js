const express = require('express');
const {
  uploadContent,
  getContent,
  getContentById,
  deleteContent,
} = require('../controllers/contentController');
const { protect, authorize, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.get('/', protect, getContent);
router.post('/upload', protect, adminOnly, upload.single('file'), uploadContent);
router.get('/:id', protect, getContentById);
router.delete('/:id', protect, adminOnly, deleteContent);

module.exports = router;
