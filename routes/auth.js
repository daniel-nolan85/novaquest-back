const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const {
  checkBlockedList,
  createOrUpdateUser,
  currentUser,
  storeNotifToken,
  deleteAccount,
  sendEmail,
} = require('../controllers/auth');

router.get('/check-blocked-list/:email', checkBlockedList);
router.post('/create-or-update-user', authCheck, createOrUpdateUser);
router.post('/current-user', authCheck, currentUser);
router.put('/store-notification-token', authCheck, storeNotifToken);
router.put('/delete-account', authCheck, deleteAccount);
router.post('/send-email', authCheck, sendEmail);

module.exports = router;
