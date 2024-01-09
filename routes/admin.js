const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const {
  fetchReportedPosts,
  fetchAllPosts,
  fetchAllUsers,
} = require('../controllers/admin');

router.get('/fetch-reported-posts', authCheck, fetchReportedPosts);
router.get('/fetch-all-posts', authCheck, fetchAllPosts);
router.get('/fetch-all-users', authCheck, fetchAllUsers);

module.exports = router;
