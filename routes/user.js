const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const {
  updateUserName,
  badgeUnlocked,
  updateTextSpeed,
  updateViewedRovers,
} = require('../controllers/user');

router.put('/update-user-name', authCheck, updateUserName);
router.put('/badge-unlocked', authCheck, badgeUnlocked);
router.put('/update-text-speed', authCheck, updateTextSpeed);
router.put('/update-viewed-rovers', authCheck, updateViewedRovers);

module.exports = router;
