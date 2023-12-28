const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

exports.uploadImagesToCloudinary = async (req, res) => {
  try {
    if (req.files && Object.keys(req.files).length > 0) {
      const results = await Promise.all(
        Object.values(req.files).map(async (file) => {
          try {
            const result = await cloudinary.uploader.upload(file.path, {});
            return { public_id: result.public_id, url: result.secure_url };
          } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            return null;
          }
        })
      );
      const validResults = results.filter((result) => result !== null);
      res.json(validResults);
    } else {
      res.status(400).json({ error: 'No images provided' });
    }
  } catch (error) {
    console.error('Error processing images:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
