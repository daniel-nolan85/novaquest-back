const Post = require('../models/post');
const User = require('../models/user');
const cloudinary = require('cloudinary');
const { Expo } = require('expo-server-sdk');

const expo = new Expo();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

exports.submitPostWithMedia = async (req, res) => {
  const { _id, text, media } = req.body;
  try {
    if (!text.length) {
      res.json({
        error: 'Content is required',
      });
    } else {
      const post = new Post({ text, media, postedBy: _id });
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

exports.editPostWithMedia = async (req, res) => {
  const { text, media, mediaToDelete, postId } = req.body;
  try {
    const update = {};
    if (text !== undefined && text !== '') {
      update.text = text;
    }
    if (media !== undefined && Array.isArray(media) && media.length > 0) {
      update.$push = { media: { $each: media } };
    }
    if (mediaToDelete && mediaToDelete.length > 0) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { media: { public_id: { $in: mediaToDelete } } },
      });
      for (const publicId of mediaToDelete) {
        await cloudinary.uploader.destroy(publicId);
      }
    }
    const post = await Post.findByIdAndUpdate(postId, update, {
      new: true,
    });
    res.json(post);
  } catch (err) {
    console.error('Error updating post:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.editPost = async (req, res) => {
  const { text, mediaToDelete, postId } = req.body;
  try {
    const update = {};
    if (text !== undefined && text !== '') {
      update.text = text;
    }
    if (mediaToDelete && mediaToDelete.length > 0) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { media: { public_id: { $in: mediaToDelete } } },
      });
      for (const publicId of mediaToDelete) {
        await cloudinary.uploader.destroy(publicId);
      }
    }
    const post = await Post.findByIdAndUpdate(postId, update, {
      new: true,
    });
    res.json(post);
  } catch (err) {
    console.error('Error updating post:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deletePost = async (req, res) => {
  const { postId } = req.body;
  try {
    const post = await Post.findById(postId);
    const public_ids = post.media.map((img) => img.public_id);
    for (const public_id of public_ids) {
      const image = await cloudinary.uploader.destroy(public_id);
    }
    const postToDelete = await Post.findByIdAndDelete(postId);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error deleting post:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.newsFeed = async (req, res) => {
  const { _id } = req.body;
  try {
    const user = await User.findById(_id).select('blockeds');
    const blockedUserIds = user.blockeds.map((blockedUser) => blockedUser._id);
    const posts = await Post.find({
      postedBy: { $nin: blockedUserIds },
    })
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

exports.fetchSinglePost = async (req, res) => {
  const { postId } = req.body;
  try {
    const post = await Post.findById(postId)
      .populate('postedBy', '_id name rank profileImage')
      .populate('comments.postedBy', '_id name rank profileImage')
      .populate('likes', '_id name rank profileImage');
    res.json(post);
  } catch (err) {
    console.error('Error retrieving post:', err.message);
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

    const { rank, name } = await User.findById(_id).select('rank name');
    const { notificationToken } = await User.findById(post.postedBy).select(
      'notificationToken'
    );
    if (Expo.isExpoPushToken(notificationToken)) {
      const notification = {
        to: notificationToken,
        sound: 'default',
        title: 'New Like!',
        body: `${rank} ${name} liked your post.`,
        icon: 'https://res.cloudinary.com/daufzqlld/image/upload/v1704319447/icon_kv0qsw.png',
      };

      try {
        await expo.sendPushNotificationsAsync([notification]);
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError.message);
      }
    }

    if (post.postedBy.toString() !== _id) {
      const newNotification = {
        message: `${rank} ${name} liked your post.`,
        postId,
        user: _id,
      };
      const notifyOwner = await User.findByIdAndUpdate(
        post.postedBy,
        {
          $push: { notifications: newNotification },
        },
        { new: true }
      );
    }
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

    const { rank, name } = await User.findById(_id).select('rank name');
    const { notificationToken } = await User.findById(post.postedBy).select(
      'notificationToken'
    );
    if (Expo.isExpoPushToken(notificationToken)) {
      const notification = {
        to: notificationToken,
        sound: 'default',
        title: 'New Comment!',
        body: `${rank} ${name} commented on your post.`,
        icon: 'https://res.cloudinary.com/daufzqlld/image/upload/v1704319447/icon_kv0qsw.png',
      };

      try {
        await expo.sendPushNotificationsAsync([notification]);
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError.message);
      }
    }

    if (post.postedBy.toString() !== _id) {
      const newNotification = {
        message: `${rank} ${name} commented on your post.`,
        postId,
        user: _id,
      };
      const notifyOwner = await User.findByIdAndUpdate(
        post.postedBy,
        {
          $push: { notifications: newNotification },
        },
        { new: true }
      );
    }
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
