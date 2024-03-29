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
  const { _id, text, media, explorers } = req.body;
  try {
    if (!text.length) {
      res.json({
        error: 'Content is required',
      });
    } else {
      const post = new Post({ text, media, postedBy: _id });
      post.save();
      const user = await User.findById(_id).select(
        'numOfPosts achievedCelestialContributor achievedProlificExplorer achievedGalaxyLuminary achievedCosmicChronicler'
      );
      const numOfPosts = user.numOfPosts + 1;
      const updateFields = {};
      let achievement = '';
      if (numOfPosts === 1 && !user.achievedCelestialContributor) {
        updateFields.achievedCelestialContributor = true;
        achievement = 'FirstPost';
      } else if (numOfPosts === 10 && !user.achievedProlificExplorer) {
        updateFields.achievedProlificExplorer = true;
        achievement = 'TenthPost';
      } else if (numOfPosts === 50 && !user.achievedGalaxyLuminary) {
        updateFields.achievedGalaxyLuminary = true;
        achievement = 'FiftiethPost';
      } else if (numOfPosts === 250 && !user.achievedCosmicChronicler) {
        updateFields.achievedCosmicChronicler = true;
        achievement = 'TwoHundredFiftiethPost';
      }
      user.set({
        numOfPosts: user.numOfPosts + 1,
        ...updateFields,
      });
      await user.save();
      res.json(achievement);

      const { rank, name } = user;
      for (const explorer of explorers) {
        const { notificationToken } = await User.findById(explorer).select(
          'notificationToken'
        );
        if (Expo.isExpoPushToken(notificationToken)) {
          const notification = {
            to: notificationToken,
            sound: 'default',
            title: 'New Post!',
            body: `${rank} ${name} created a new post.`,
            icon: 'https://res.cloudinary.com/dntxhyxtx/image/upload/v1706308808/novaquest_m0vc8g.png',
          };
          try {
            await expo.sendPushNotificationsAsync([notification]);
          } catch (notificationError) {
            console.error(
              'Error sending notification:',
              notificationError.message
            );
          }
        }
      }
    }
  } catch (err) {
    console.error('Error submitting post:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.submitPost = async (req, res) => {
  const { _id, text, explorers } = req.body;
  try {
    if (!text.length) {
      res.json({
        error: 'Content is required',
      });
    } else {
      const post = new Post({ text, postedBy: _id });
      post.save();
      const user = await User.findById(_id).select(
        'numOfPosts achievedCelestialContributor achievedProlificExplorer achievedGalaxyLuminary achievedCosmicChronicler rank name'
      );
      const numOfPosts = user.numOfPosts + 1;
      const updateFields = {};
      let achievement = '';
      if (numOfPosts === 1 && !user.achievedCelestialContributor) {
        updateFields.achievedCelestialContributor = true;
        achievement = 'FirstPost';
      } else if (numOfPosts === 10 && !user.achievedProlificExplorer) {
        updateFields.achievedProlificExplorer = true;
        achievement = 'TenthPost';
      } else if (numOfPosts === 50 && !user.achievedGalaxyLuminary) {
        updateFields.achievedGalaxyLuminary = true;
        achievement = 'FiftiethPost';
      } else if (numOfPosts === 250 && !user.achievedCosmicChronicler) {
        updateFields.achievedCosmicChronicler = true;
        achievement = 'TwoHundredFiftiethPost';
      }
      user.set({
        numOfPosts: user.numOfPosts + 1,
        ...updateFields,
      });
      await user.save();
      res.json(achievement);

      const { rank, name } = user;
      for (const explorer of explorers) {
        const { notificationToken } = await User.findById(explorer).select(
          'notificationToken'
        );
        if (Expo.isExpoPushToken(notificationToken)) {
          const notification = {
            to: notificationToken,
            sound: 'default',
            title: 'New Post!',
            body: `${rank} ${name} created a new post.`,
            icon: 'https://res.cloudinary.com/dntxhyxtx/image/upload/v1706308808/novaquest_m0vc8g.png',
          };
          try {
            await expo.sendPushNotificationsAsync([notification]);
          } catch (notificationError) {
            console.error(
              'Error sending notification:',
              notificationError.message
            );
          }
        }
      }
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
  const { _id, postId } = req.body;
  try {
    const post = await Post.findById(postId);
    const public_ids = post.media.map((img) => img.public_id);
    for (const public_id of public_ids) {
      const image = await cloudinary.uploader.destroy(public_id);
    }
    const postToDelete = await Post.findByIdAndDelete(postId);
    const user = await User.findByIdAndUpdate(
      _id,
      { $inc: { numOfPosts: -1 } },
      { new: true }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Error deleting post:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.newsFeed = async (req, res) => {
  const { _id, page, pageSize } = req.body;
  try {
    const user = await User.findById(_id).select('blockeds');
    const blockedUserIds = user.blockeds.map((blockedUser) => blockedUser._id);
    const posts = await Post.find({
      postedBy: { $nin: blockedUserIds },
    })
      .populate('postedBy', '_id name rank profileImage role')
      .populate('comments.postedBy', '_id name rank profileImage role')
      .populate('likes', '_id name rank profileImage role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
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
      .populate('postedBy', '_id name rank profileImage role')
      .populate('comments.postedBy', '_id name rank profileImage role')
      .populate('likes', '_id name rank profileImage role');
    res.json(post);
  } catch (err) {
    console.error('Error retrieving post:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.fetchUsersPosts = async (req, res) => {
  const { _id, page, pageSize, initialIndex } = req.body;
  try {
    const posts = await Post.find({ postedBy: _id })
      .populate('postedBy', '_id name rank profileImage role')
      .populate('comments.postedBy', '_id name rank profileImage role')
      .populate('likes', '_id name rank profileImage role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    res.json(posts);
  } catch (err) {
    console.error('Error retrieving posts:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.fetchUsersStars = async (req, res) => {
  const { _id, page, pageSize, initialIndex } = req.body;
  try {
    const posts = await Post.find({ likes: { $in: [_id] } })
      .populate('postedBy', '_id name rank profileImage role')
      .populate('comments.postedBy', '_id name rank profileImage role')
      .populate('likes', '_id name rank profileImage role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
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
      .populate('likes', '_id name rank profileImage role')
      .populate('comments.postedBy', '_id name rank profileImage role');

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
        icon: 'https://res.cloudinary.com/dntxhyxtx/image/upload/v1706308808/novaquest_m0vc8g.png',
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

    const user = await User.findById(_id).select(
      'numOfStars achievedStellarSupporter'
    );

    const numOfStars = user.numOfStars + 1;
    const updateFields = {};
    let achievement = '';

    if (numOfStars === 300 && !user.achievedStellarSupporter) {
      updateFields.achievedStellarSupporter = true;
      achievement = 'ThreeHundredStars';
    }

    user.set({
      numOfStars: user.numOfStars + 1,
      ...updateFields,
    });

    await user.save();

    res.json({ post, achievement });
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
    const user = await User.findByIdAndUpdate(
      _id,
      { $inc: { numOfStars: -1 } },
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

    const user = await User.findById(_id).select(
      'numOfComments achievedCosmicConversationalist'
    );

    const numOfComments = user.numOfComments + 1;
    const updateFields = {};
    let achievement = '';

    if (numOfComments === 300 && !user.achievedCosmicConversationalist) {
      updateFields.achievedCosmicConversationalist = true;
      achievement = 'ThreeHundredComments';
    }

    user.set({
      numOfComments: user.numOfComments + 1,
      ...updateFields,
    });

    await user.save();

    res.json({ post, achievement });

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
        icon: 'https://res.cloudinary.com/dntxhyxtx/image/upload/v1706308808/novaquest_m0vc8g.png',
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
      .populate('comments.postedBy', '_id name rank profileImage role')
      .sort({ createdAt: -1 });
    res.json(post);
  } catch (err) {
    console.error('Error retrieving comments:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.reportPost = async (req, res) => {
  const { postId } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $set: { reported: true },
      },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    console.error('Error retrieving comments:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.filterPostsByQuery = async (req, res) => {
  const { query } = req.body;
  try {
    let posts = await Post.find()
      .populate('postedBy', '_id name rank profileImage role')
      .sort({ createdAt: -1 })
      .exec();
    posts = posts.filter((post) => {
      const postTextLower = post.text.toLowerCase();
      const userNameLower = post.postedBy.name.toLowerCase();
      return (
        postTextLower.includes(query.toLowerCase()) ||
        userNameLower.includes(query.toLowerCase())
      );
    });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching signals:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
