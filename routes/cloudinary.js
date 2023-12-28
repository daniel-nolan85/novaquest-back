const express = require('express');
const formidable = require('express-formidable');

const router = express.Router();

const { authCheck } = require('../middleware/auth');

const { uploadImagesToCloudinary } = require('../controllers/cloudinary');

router.post(
  '/upload-images',
  authCheck,
  formidable({ maxFileSize: 10 * 1024 * 1024 }),
  uploadImagesToCloudinary
);

module.exports = router;
