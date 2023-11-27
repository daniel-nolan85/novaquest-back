const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const { createOrLocateUser, currentUser } = require('../controllers/auth');

router.post('/create-or-locate-user', authCheck, createOrLocateUser);
router.post('/current-user', authCheck, currentUser);

module.exports = router;
