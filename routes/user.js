const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const {
  updateUserName,
  updateWelcomeComplete,
  updateTextSpeed,
} = require('../controllers/user');

router.put('/update-user-name', authCheck, updateUserName);
router.put('/update-welcome-complete', authCheck, updateWelcomeComplete);
router.put('/update-text-speed', authCheck, updateTextSpeed);

module.exports = router;
