const express = require('express');
const formidable = require('express-formidable');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const {
  uploadImagesToCloudinary,
  submitPostWithImages,
  submitPost,
  newsFeed,
  fetchUsersPosts,
} = require('../controllers/post');

router.post(
  '/upload-images',
  authCheck,
  formidable({ maxFileSize: 10 * 1024 * 1024 }),
  uploadImagesToCloudinary
);
router.post('/submit-post-with-images', authCheck, submitPostWithImages);
router.post('/submit-post', authCheck, submitPost);
router.get('/news-feed', authCheck, newsFeed);
router.post('/users-posts', authCheck, fetchUsersPosts);

module.exports = router;
