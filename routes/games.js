const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const {
  fetchLeaderboard,
  filterPlayersByQuery,
} = require('../controllers/games');

router.post('/fetch-leaderboard', authCheck, fetchLeaderboard);
router.post('/filter-players-by-query', authCheck, filterPlayersByQuery);

module.exports = router;
