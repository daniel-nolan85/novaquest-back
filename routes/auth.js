const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const {
  createOrUpdateUser,
  currentUser,
  storeNotifToken,
} = require('../controllers/auth');

router.post('/create-or-update-user', authCheck, createOrUpdateUser);
router.post('/current-user', authCheck, currentUser);
router.put('/store-notification-token', authCheck, storeNotifToken);

module.exports = router;
