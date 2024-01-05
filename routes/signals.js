const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const {
  filterSignalsByDate,
  filterSignalsByQuery,
} = require('../controllers/signals');

router.post('/filter-signals-by-date', authCheck, filterSignalsByDate);
router.post('/filter-signals-by-query', authCheck, filterSignalsByQuery);

module.exports = router;
