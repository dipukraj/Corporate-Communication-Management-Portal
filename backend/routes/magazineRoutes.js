const express = require('express');
const {
  createMagazine,
  getMagazines,
  deleteMagazine,
} = require('../controllers/magazineController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.get('/', protect, getMagazines);
router.post('/', protect, authorize('admin', 'editor'), upload.single('pdf'), createMagazine);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteMagazine);

module.exports = router;
