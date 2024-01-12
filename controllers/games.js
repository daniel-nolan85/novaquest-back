const Leaderboard = require('../models/leaderboard');

exports.fetchLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find({})
      .populate('player', '_id rank name profileImage')
      .sort({ score: -1 });
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.filterPlayersByQuery = async (req, res) => {
  const { query } = req.body;
  try {
    const leaderboard = await Leaderboard.find({}).populate(
      'player',
      '_id rank name profileImage'
    );
    const filteredPlayers = leaderboard
      .filter((entry) =>
        entry.player.name.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => b.score - a.score); // Sort by high score
    res.json(filteredPlayers);
  } catch (error) {
    console.error('Error fetching players:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
