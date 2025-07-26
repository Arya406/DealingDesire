const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

// Define routes with proper path definitions
router.route('/register')
  .post(register);

router.route('/login')
  .post(login);

// Protected route - requires valid token
router.get('/me', auth, getMe);

module.exports = router;
