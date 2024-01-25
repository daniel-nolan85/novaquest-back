const express = require('express');
const formidable = require('express-formidable');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const {
  uploadMediaToCloudinary,
  destroyMediaFromCloudinary,
} = require('../controllers/cloudinary');

router.post(
  '/upload-media',
  formidable({ maxFileSize: 100 * 1024 * 1024 }),
  uploadMediaToCloudinary
);
router.post('/destroy-media', authCheck, destroyMediaFromCloudinary);

module.exports = router;
