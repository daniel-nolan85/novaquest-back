const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const {
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
  updateProfileWithImage,
  updateProfile,
  usersAchievements,
  blockUser,
  incrementNotifsCount,
  resetNotifsCount,
  fetchUserSignals,
} = require('../controllers/user');

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
router.put('/update-profile-with-image', authCheck, updateProfileWithImage);
router.put('/update-profile', authCheck, updateProfile);
router.post('/users-achievements', authCheck, usersAchievements);
router.put('/block-user', authCheck, blockUser);
router.put(
  '/increment-new-notifications-count',
  authCheck,
  incrementNotifsCount
);
router.put('/reset-new-notifications-count', authCheck, resetNotifsCount);
router.post('/fetch-user-notifications', authCheck, fetchUserSignals);

module.exports = router;
