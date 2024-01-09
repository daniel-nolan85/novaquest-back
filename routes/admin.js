const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const {
  fetchReportedPosts,
  fetchAllPosts,
  fetchAllUsers,
  deleteUser,
} = require('../controllers/admin');

router.get('/fetch-reported-posts', authCheck, fetchReportedPosts);
router.get('/fetch-all-posts', authCheck, fetchAllPosts);
router.get('/fetch-all-users', authCheck, fetchAllUsers);
router.put('/delete-user', authCheck, deleteUser);

module.exports = router;
