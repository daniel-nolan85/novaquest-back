const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

exports.uploadMediaToCloudinary = async (req, res) => {
  console.log('uploading');
  try {
    if (req.files && Object.keys(req.files).length > 0) {
      const results = await Promise.all(
        Object.values(req.files).map(async (file) => {
          try {
            if (file.type.startsWith('image')) {
              const result = await cloudinary.v2.uploader.upload(file.path, {
                resource_type: 'image',
              });
              return {
                public_id: result.public_id,
                url: result.secure_url,
                type: 'image',
              };
            } else if (file.type.startsWith('video')) {
              const result = await cloudinary.v2.uploader.upload(file.path, {
                resource_type: 'video',
              });
              return {
                public_id: result.public_id,
                url: result.secure_url,
                type: 'video',
              };
            } else {
              console.error('Unsupported file type:', file.type);
              return null;
            }
          } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            return null;
          }
        })
      );

      const validResults = results.filter((result) => result !== null);
      res.json(validResults);
    } else {
      res.status(400).json({ error: 'No media files provided' });
    }
  } catch (error) {
    console.error('Error processing media:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.destroyMediaFromCloudinary = async (req, res) => {
  const { publicId } = req.body;
  await cloudinary.uploader.destroy(publicId);
  res.json({ ok: true });
};
