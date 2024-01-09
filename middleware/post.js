const Post = require('../models/post');
const User = require('../models/user');

exports.canEditDeletePost = async (req, res, next) => {
  const { _id, postId } = req.body;

  try {
    const post = await Post.findById(postId);
    const role = await User.findById(_id).select('role');

    if (role.role === 'admin' || _id.toString() === post.postedBy.toString()) {
      next();
    } else {
      return res.status(403).send('Unauthorized');
    }
  } catch (err) {
    console.error(err);
  }
};
