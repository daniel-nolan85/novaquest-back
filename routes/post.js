const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const {
  submitPostWithMedia,
  submitPost,
  editPostWithMedia,
  editPost,
  newsFeed,
  fetchUsersPosts,
  fetchUsersStars,
  likePost,
  unlikePost,
  addComment,
  fetchComments,
} = require('../controllers/post');

router.post('/submit-post-with-media', authCheck, submitPostWithMedia);
router.post('/submit-post', authCheck, submitPost);
router.put('/edit-post-with-media', authCheck, editPostWithMedia);
router.put('/edit-post', authCheck, editPost);
router.post('/news-feed', authCheck, newsFeed);
router.post('/users-posts', authCheck, fetchUsersPosts);
router.post('/users-stars', authCheck, fetchUsersStars);
router.put('/like-post', authCheck, likePost);
router.put('/unlike-post', authCheck, unlikePost);
router.put('/add-comment', authCheck, addComment);
router.post('/get-comments', authCheck, fetchComments);

module.exports = router;
