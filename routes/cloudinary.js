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
  authCheck,
  formidable({ maxFileSize: 100 * 1024 * 1024 }),
  uploadMediaToCloudinary
);

module.exports = router;
