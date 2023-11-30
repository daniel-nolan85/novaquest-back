const User = require('../models/user');

exports.updateUserName = async (req, res) => {
  const { _id, name } = req.body;

  if (!_id || !name) {
    return res
      .status(400)
      .json({ error: 'Invalid request. Missing required parameters.' });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id },
      { $set: { name } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.badgeUnlocked = async (req, res) => {
  const { _id, badge } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { _id },
      { $set: { [badge]: true } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateTextSpeed = async (req, res) => {
  let { _id, textSpeed } = req.body;

  if (!_id || !textSpeed) {
    return res
      .status(400)
      .json({ error: 'Invalid request. Missing required parameters.' });
  }

  if (textSpeed === 'slow') {
    textSpeed = 100;
  } else if (textSpeed === 'medium') {
    textSpeed = 50;
  } else {
    textSpeed = 1;
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id },
      { $set: { textSpeed } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
