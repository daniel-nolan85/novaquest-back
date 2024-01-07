const express = require('express');

const router = express.Router();

const { authCheck } = require('../middleware/auth');
const { canEditDeletePost } = require('../middleware/post');

const {
  submitPostWithMedia,
  submitPost,
  editPostWithMedia,
  editPost,
  deletePost,
  newsFeed,
  fetchSinglePost,
  fetchUsersPosts,
  fetchUsersStars,
  likePost,
  unlikePost,
  addComment,
  fetchComments,
  reportPost,
  filterPostsByQuery,
} = require('../controllers/post');

router.post('/submit-post-with-media', authCheck, submitPostWithMedia);
router.post('/submit-post', authCheck, submitPost);
router.put(
  '/edit-post-with-media',
  authCheck,
  canEditDeletePost,
  editPostWithMedia
);
router.put('/edit-post', authCheck, canEditDeletePost, editPost);
router.put('/delete-post', authCheck, canEditDeletePost, deletePost);
router.post('/news-feed', authCheck, newsFeed);
router.post('/single-post', authCheck, fetchSinglePost);
router.post('/users-posts', authCheck, fetchUsersPosts);
router.post('/users-stars', authCheck, fetchUsersStars);
router.put('/like-post', authCheck, likePost);
router.put('/unlike-post', authCheck, unlikePost);
router.put('/add-comment', authCheck, addComment);
router.post('/get-comments', authCheck, fetchComments);
router.post('/report-post', authCheck, reportPost);
router.post('/filter-posts-by-query', authCheck, filterPostsByQuery);

module.exports = router;
