const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, index: true },
    role: { type: String, default: 'subscriber' },
    lastLoginDate: String,
    daysInSpace: Number,
    textSpeed: { type: Number, default: 50 },
    viewedRovers: [{ type: String }],
    viewedRoverCameras: [{ type: String }],
    viewedRoverDateTypes: [{ type: String }],
    achievedCosmicPioneer: { type: Boolean, default: false },
    achievedAdventurousExplorer: { type: Boolean, default: false },
    achievedStellarVoyager: { type: Boolean, default: false },
    achievedAstroPioneer: { type: Boolean, default: false },
    achievedCosmicTrailblazer: { type: Boolean, default: false },
    achievedCelestialNomad: { type: Boolean, default: false },
    achievedGalacticWayfarer: { type: Boolean, default: false },
    achievedInterstellarVoyager: { type: Boolean, default: false },
    achievedStellarCenturion: { type: Boolean, default: false },
    achievedVoyagerExtraordinaire: { type: Boolean, default: false },
    achievedRedPlanetVoyager: { type: Boolean, default: false },
    achievedMarsRoverMaestro: { type: Boolean, default: false },
    achievedMartianLensMaster: { type: Boolean, default: false },
    achievedCosmicChronologist: { type: Boolean, default: false },
    achievedCosmicCadet: { type: Boolean, default: false },
    achievedStarNavigator: { type: Boolean, default: false },
    achievedGalacticSage: { type: Boolean, default: false },
    achievedNovaScholar: { type: Boolean, default: false },
    achievedQuasarVirtuoso: { type: Boolean, default: false },
    achievedSupernovaSavant: { type: Boolean, default: false },
    achievedLightSpeedExplorer: { type: Boolean, default: false },
    achievedOdysseyTrailblazer: { type: Boolean, default: false },
    achievedInfinityVoyager: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
