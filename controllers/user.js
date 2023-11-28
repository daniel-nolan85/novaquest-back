const User = require('../models/user');

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
