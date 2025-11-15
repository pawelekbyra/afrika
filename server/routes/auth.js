
const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
} = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', auth, getUserProfile);

module.exports = router;
