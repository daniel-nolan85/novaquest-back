const User = require('../models/user');

exports.createOrLocateUser = async (req, res) => {
  try {
    const { email } = req.user;
    const user = await User.findOne({ email });

    if (user) {
      res.json(user);
    } else {
      const newUser = await new User({ email }).save();
      res.json(newUser);
    }
  } catch (error) {
    console.error('Error in createOrLocateUser:', error.message);
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
