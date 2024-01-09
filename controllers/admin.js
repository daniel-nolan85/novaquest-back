const Post = require('../models/post');
const User = require('../models/user');
const Blocked = require('../models/blocked');
const admin = require('../firebase');

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
    const users = await User.find()
      .select('_id profileImage name rank daysInSpace bio')
      .exec();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findByIdAndDelete(userId).select('rank name email');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const blocked = await new Blocked({
      email: user.email,
    }).save();
    const userRecord = await admin.auth().getUserByEmail(user.email);
    const uid = userRecord.uid;
    await admin.auth().deleteUser(uid);
    res.json(user);
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
