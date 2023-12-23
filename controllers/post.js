const Post = require('../models/post');
const User = require('../models/user');
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

exports.submitPostWithImages = async (req, res) => {
  const { _id, text, images } = req.body;
  try {
    if (!text.length) {
      res.json({
        error: 'Content is required',
      });
    } else {
      const post = new Post({ text, images, postedBy: _id });
      post.save();
      res.json(post);
    }
  } catch (err) {
    console.error('Error submitting post:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.submitPost = async (req, res) => {
  const { _id, text } = req.body;
  try {
    if (!text.length) {
      res.json({
        error: 'Content is required',
      });
    } else {
      const post = new Post({ text, postedBy: _id });
      post.save();
      res.json(post);
    }
  } catch (err) {
    console.error('Error submitting post:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.newsFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('postedBy', '_id name rank')
      .populate('comments.postedBy', '_id name rank')
      .populate('likes', '_id name rank')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error retrieving posts:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.fetchUsersPosts = async (req, res) => {
  const { _id } = req.body;
  try {
    const posts = await Post.find({ postedBy: _id })
      .populate('postedBy', '_id name rank')
      .populate('comments.postedBy', '_id name rank')
      .populate('likes', '_id name rank')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error retrieving posts:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
