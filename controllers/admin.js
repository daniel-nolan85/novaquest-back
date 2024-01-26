const Post = require('../models/post');
const User = require('../models/user');
const Blocked = require('../models/blocked');
const Leaderboard = require('../models/leaderboard');
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
    const user = await User.findByIdAndDelete(userId).select(
      'rank name email ipAddresses'
    );
    const posts = await Post.deleteMany({ postedBy: userId });
    const comments = await Post.updateMany({
      $pull: { comments: { postedBy: userId } },
    });
    const likes = await Post.updateMany({ $pull: { likes: userId } });
    const allies = await User.updateMany({ $pull: { allies: userId } });
    const explorers = await User.updateMany({ $pull: { explorers: userId } });
    const blockeds = await User.updateMany({ $pull: { blockeds: userId } });
    const leaderboard = await Leaderboard.deleteMany({
      player: userId,
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.email) {
      const blocked = await new Blocked({
        ipAddresses: user.ipAddresses,
        email: user.email,
      }).save();
    }
    if (user.email) {
      const userRecord = await admin.auth().getUserByEmail(user.email);
      const uid = userRecord.uid;
      await admin.auth().deleteUser(uid);
    }
    res.json(user);
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
