const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const {
  submitPostWithImages,
  submitPost,
  newsFeed,
  fetchUsersPosts,
} = require('../controllers/post');

router.post('/submit-post-with-images', authCheck, submitPostWithImages);
router.post('/submit-post', authCheck, submitPost);
router.get('/news-feed', authCheck, newsFeed);
router.post('/users-posts', authCheck, fetchUsersPosts);

module.exports = router;
