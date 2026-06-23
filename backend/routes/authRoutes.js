const express = require('express');
const { register, login, getMe, signup } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/me', protect, getMe);
router.post('/register', protect, authorize('admin'), register);

module.exports = router;
