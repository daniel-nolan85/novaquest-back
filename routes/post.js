const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const {
  submitPostWithImages,
  submitPost,
  newsFeed,
  fetchUsersPosts,
  fetchUsersStars,
  likePost,
  unlikePost,
  addComment,
  fetchComments,
} = require('../controllers/post');

router.post('/submit-post-with-images', authCheck, submitPostWithImages);
router.post('/submit-post', authCheck, submitPost);
router.get('/news-feed', authCheck, newsFeed);
router.post('/users-posts', authCheck, fetchUsersPosts);
router.post('/users-stars', authCheck, fetchUsersStars);
router.put('/like-post', authCheck, likePost);
router.put('/unlike-post', authCheck, unlikePost);
router.put('/add-comment', authCheck, addComment);
router.post('/get-comments', authCheck, fetchComments);

module.exports = router;
