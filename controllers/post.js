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

exports.fetchUsersStars = async (req, res) => {
  const { _id } = req.body;
  try {
    const posts = await Post.find({ likes: { $in: [_id] } })
      .populate('postedBy', '_id name rank profileImage')
      .populate('comments.postedBy', '_id name rank profileImage')
      .populate('likes', '_id name rank profileImage')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error retrieving stars:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.likePost = async (req, res) => {
  const { _id, postId } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: _id } },
      { new: true }
    )
      .populate('likes', '_id name rank profileImage')
      .populate('comments.postedBy', '_id name rank profileImage');
    res.json(post);
  } catch (err) {
    console.error('Error liking post:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.unlikePost = async (req, res) => {
  const { _id, postId } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: _id },
      },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    console.error('Error unliking post:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addComment = async (req, res) => {
  const { _id, postId, text } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { text, postedBy: _id } },
      },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    console.error('Error commenting on post:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.fetchComments = async (req, res) => {
  const { postId } = req.body;
  try {
    const post = await Post.findById(postId)
      .select('comments')
      .populate('comments.postedBy', '_id name rank profileImage')
      .sort({ createdAt: -1 });
    res.json(post);
  } catch (err) {
    console.error('Error retrieving comments:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
