const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const {
  updateUserName,
  badgeUnlocked,
  updateTextSpeed,
} = require('../controllers/user');

router.put('/update-user-name', authCheck, updateUserName);
router.put('/badge-unlocked', authCheck, badgeUnlocked);
router.put('/update-text-speed', authCheck, updateTextSpeed);

module.exports = router;
