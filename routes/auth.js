const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const {
  checkBlockedList,
  createOrUpdateUser,
  createGuestUser,
  currentUser,
  storeNotifToken,
  deleteAccount,
  sendEmail,
} = require('../controllers/auth');

router.post('/check-blocked-list', checkBlockedList);
router.post('/create-or-update-user', authCheck, createOrUpdateUser);
router.post('/create-guest-user', authCheck, createGuestUser);
router.post('/current-user', authCheck, currentUser);
router.put('/store-notification-token', authCheck, storeNotifToken);
router.put('/delete-account', authCheck, deleteAccount);
router.post('/send-email', authCheck, sendEmail);

module.exports = router;
