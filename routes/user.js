const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const {
  updateUserName,
  awardXP,
  badgeUnlocked,
  promoteUser,
  updateTextSpeed,
  updateViewedRovers,
  checkTriviaAchievements,
  fetchThisUser,
  followMember,
  unfollowMember,
  getAllies,
  getExplorers,
} = require('../controllers/user');

router.put('/update-user-name', authCheck, updateUserName);
router.put('/award-xp', authCheck, awardXP);
router.put('/badge-unlocked', authCheck, badgeUnlocked);
router.put('/promote-user', authCheck, promoteUser);
router.put('/update-text-speed', authCheck, updateTextSpeed);
router.put('/update-viewed-rovers', authCheck, updateViewedRovers);
router.put('/check-trivia-achievements', authCheck, checkTriviaAchievements);
router.post('/fetch-this-user', authCheck, fetchThisUser);
router.put('/follow-member', authCheck, followMember);
router.put('/unfollow-member', authCheck, unfollowMember);
router.post('/fetch-allies', authCheck, getAllies);
router.post('/fetch-explorers', authCheck, getExplorers);

module.exports = router;
