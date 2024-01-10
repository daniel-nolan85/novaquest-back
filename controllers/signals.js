const User = require('../models/user');

exports.filterSignalsByDate = async (req, res) => {
  const { _id, startDate, endDate } = req.body;
  const startDateTime = new Date(startDate);
  startDateTime.setHours(0, 0, 0, 0);
  const endDateTime = new Date(endDate);
  endDateTime.setHours(23, 59, 59, 999);
  try {
    const signals = await User.findById(_id)
      .select('notifications')
      .where('notifications.timestamp')
      .gte(startDateTime)
      .lte(endDateTime);
    res.json(signals);
  } catch (error) {
    console.error('Error fetching signals:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.filterSignalsByQuery = async (req, res) => {
  const { _id, query } = req.body;
  try {
    const user = await User.findById(_id).select('notifications');
    const signals = user.notifications.filter((signal) => {
      return signal.message.toLowerCase().includes(query.toLowerCase());
    });

    res.json(signals);
  } catch (error) {
    console.error('Error fetching signals:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
