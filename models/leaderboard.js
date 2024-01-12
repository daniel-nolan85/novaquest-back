const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const leaderboardSchema = new mongoose.Schema(
  {
    player: {
      type: ObjectId,
      ref: 'User',
    },
    score: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
