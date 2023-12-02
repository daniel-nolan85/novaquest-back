const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, index: true },
    role: { type: String, default: 'subscriber' },
    textSpeed: { type: Number, default: 50 },
    viewedRovers: [{ type: String }],
    viewedRoverCameras: [{ type: String }],
    viewedRoverDateTypes: [{ type: String }],
    achievedCosmicPioneer: { type: Boolean, default: false },
    achievedRedPlanetVoyager: { type: Boolean, default: false },
    achievedMarsRoverMaestro: { type: Boolean, default: false },
    achievedMartianLensMaster: { type: Boolean, default: false },
    achievedCosmicChronologist: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
