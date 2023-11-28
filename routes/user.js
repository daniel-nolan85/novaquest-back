const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const { updateTextSpeed } = require('../controllers/user');

router.put('/update-text-speed', authCheck, updateTextSpeed);

module.exports = router;
