const Post = require('../models/post');

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
      .populate('postedBy', '_id name rank profileImage')
      .populate('comments.postedBy', '_id name rank profileImage')
      .populate('likes', '_id name rank profileImage')
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
      .populate('postedBy', '_id name rank profileImage')
      .populate('comments.postedBy', '_id name rank profileImage')
      .populate('likes', '_id name rank profileImage')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error retrieving posts:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
