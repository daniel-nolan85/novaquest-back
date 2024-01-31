const User = require('../models/user');
const Blocked = require('../models/blocked');
const Post = require('../models/post');
const Leaderboard = require('../models/leaderboard');
const admin = require('../firebase');
const nodemailer = require('nodemailer');

exports.checkBlockedList = async (req, res) => {
  const { ip, email } = req.body;
  const user = await Blocked.find({
    $or: [{ ipAddresses: ip }, { email }],
  }).select('_id');
  res.json(user);
};

exports.createOrUpdateUser = async (req, res) => {
  try {
    const { ip } = req.body;
    const { email } = req.user;
    const user = await User.findOne({ email });
    const today = new Date().toDateString();

    if (user) {
      const updatedUser = await User.findOneAndUpdate(
        { email },
        {
          $addToSet: { ipAddresses: ip },
          $set: { lastLoginDate: today },
          $inc: { daysInSpace: user.lastLoginDate !== today ? 1 : 0 },
        },
        { new: true }
      ).select('-notifications');
      res.json(updatedUser);

      console.log({ updatedUser });
    } else {
      const newUser = await new User({
        email,
        daysInSpace: 1,
        lastLoginDate: today,
        ipAddresses: [ip],
      }).save();
      res.json(newUser);
    }
  } catch (error) {
    console.error('Error in createOrUpdateUser:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createGuestUser = async (req, res) => {
  const today = new Date().toDateString();
  try {
    const guestUser = await new User({
      daysInSpace: 1,
      lastLoginDate: today,
      role: 'guest',
    }).save();
    res.json(guestUser);
  } catch (error) {
    console.error('Error in createGuestUser:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.currentUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).exec();
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.storeNotifToken = async (req, res) => {
  const { _id, notificationToken } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      { notificationToken },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteAccount = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findByIdAndDelete(userId).select('rank name email');
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
    const userRecord = await admin.auth().getUserByEmail(user.email);
    const uid = userRecord.uid;
    await admin.auth().deleteUser(uid);
    res.json(user);
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.sendEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nolancode20@gmail.com',
      pass: process.env.GMAIL_AUTHORIZATION,
    },
    secure: true,
  });

  let mailOptions = {
    from: 'nolancode20@gmail.com',
    to: 'nolancode20@gmail.com',
    subject: subject,
    html: `
      <h3>Information</h3>
      <ul>
      <li>Name: ${name}</li>
      <li>Email: ${email}</li>
      </ul>

      <h3>Message</h3>
      <p>${message}</p>
      `,
  };

  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      res.send(err);
    } else {
      res.send('Success');
    }
  });

  transporter.close();
};
