const Post = require('../models/post');
const User = require('../models/user');

exports.fetchReportedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ reported: true })
      .populate('postedBy', '_id profileImage name rank')
      .exec();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.fetchAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('postedBy', '_id profileImage name rank')
      .exec();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('_id profileImage name rank').exec();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
