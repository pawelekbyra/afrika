
const express = require('express');
const router = express.Router();
const {
  updateUserProfile,
  changePassword,
  deleteAccount,
} = require('../controllers/userController');
const auth = require('../middleware/auth');

router.put('/profile', auth, updateUserProfile);
router.put('/password', auth, changePassword);
router.delete('/profile', auth, deleteAccount);

module.exports = router;
