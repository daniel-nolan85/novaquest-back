const Post = require('../models/post');

exports.canEditDeletePost = async (req, res, next) => {
  const { _id, postId } = req.body;

  try {
    const post = await Post.findById(postId);

    if (_id != post.postedBy) {
      return res.status(400).send('Unauthorized');
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
  }
};
