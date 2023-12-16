const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const { createOrUpdateUser, currentUser } = require('../controllers/auth');

router.post('/create-or-update-user', authCheck, createOrUpdateUser);
router.post('/current-user', authCheck, currentUser);

module.exports = router;
