const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const {
  updateUserName,
  awardXP,
  badgeUnlocked,
  promoteUser,
  updateTextSpeed,
  updateSoundEffects,
  confirmUserEmail,
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
  catchScore,
  awardAchievement,
  updateViewedPlanets,
  updateApods,
  updateAsteroids,
  updateFacts,
  fetchUserExplorers,
} = require('../controllers/user');

router.put('/update-user-name', authCheck, updateUserName);
router.put('/award-xp', authCheck, awardXP);
router.put('/badge-unlocked', authCheck, badgeUnlocked);
router.put('/promote-user', authCheck, promoteUser);
router.put('/update-text-speed', authCheck, updateTextSpeed);
router.put('/update-sound-effects', authCheck, updateSoundEffects);
router.put('/confirm-user-email', authCheck, confirmUserEmail);
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
router.put('/catch-score', authCheck, catchScore);
router.put('/award-achievement', authCheck, awardAchievement);
router.put('/update-planets-viewed', authCheck, updateViewedPlanets);
router.put('/update-apods', authCheck, updateApods);
router.put('/update-asteroids', authCheck, updateAsteroids);
router.put('/update-facts', authCheck, updateFacts);
router.post('/fetch-user-explorers', authCheck, fetchUserExplorers);

module.exports = router;
