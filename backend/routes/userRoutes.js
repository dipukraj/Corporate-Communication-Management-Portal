const express = require('express');
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, getUsers);
router.route('/:id')
  .get(protect, getUser)
  .put(protect, adminOnly, updateUser)
  .delete(protect, adminOnly, deleteUser);

module.exports = router;
