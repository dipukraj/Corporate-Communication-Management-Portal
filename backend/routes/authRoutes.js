const express = require('express');
const { register, login, getMe, signup } = require('../controllers/authController');
const { protect, authorize, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/me', protect, getMe);
router.post('/register', protect, adminOnly, register);

module.exports = router;
