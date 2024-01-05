const User = require('../models/user');

exports.filterSignalsByDate = async (req, res) => {
  const { _id, startDate, endDate } = req.body;
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);
  try {
    const signals = await User.findById(_id)
      .select('notifications')
      .where('notifications.timestamp')
      .gte(startDateTime)
      .lte(endDateTime);
    console.log('signals => ', signals);
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
