const express = require('express');
const {
  createMagazine,
  getMagazines,
  deleteMagazine,
} = require('../controllers/magazineController');
const { protect, authorize, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.get('/', protect, getMagazines);
router.post('/', protect, adminOnly, upload.single('pdf'), createMagazine);
router.delete('/:id', protect, adminOnly, deleteMagazine);

module.exports = router;
