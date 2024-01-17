const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, index: true },
    role: { type: String, default: 'subscriber' },
    notificationToken: String,
    notifications: [
      {
        message: String,
        postId: { type: ObjectId, ref: 'Post' },
        user: { type: ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    newNotificationsCount: [
      {
        id: { type: String, required: true },
        message: { type: String, required: true },
      },
    ],
    xp: { type: Number, default: 0 },
    rank: { type: String, default: 'Space Explorer' },
    bio: { type: String, maxLength: 250 },
    profileImage: {
      url: String,
      public_id: String,
    },
    lastLoginDate: String,
    daysInSpace: Number,
    highScore: Number,
    allies: [{ type: ObjectId, ref: 'User' }],
    explorers: [{ type: ObjectId, ref: 'User' }],
    blockeds: [{ type: ObjectId, ref: 'User' }],
    textSpeed: { type: Number, default: 50 },
    viewedRovers: [{ type: String }],
    viewedRoverCameras: [{ type: String }],
    viewedRoverDateTypes: [{ type: String }],
    viewedPlanets: [{ type: String }],
    numOfPosts: { type: Number, default: 0 },
    numOfStars: { type: Number, default: 0 },
    numOfComments: { type: Number, default: 0 },
    numOfApods: { type: Number, default: 0 },
    numOfFacts: { type: Number, default: 0 },
    numOfAsteroids: { type: Number, default: 0 },
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
    achievedCelestialCadet: { type: Boolean, default: false },
    achievedAstroAce: { type: Boolean, default: false },
    achievedGalacticAviator: { type: Boolean, default: false },
    achievedCosmicArranger: { type: Boolean, default: false },
    achievedCelestialContributor: { type: Boolean, default: false },
    achievedProlificExplorer: { type: Boolean, default: false },
    achievedGalaxyLuminary: { type: Boolean, default: false },
    achievedCosmicChronicler: { type: Boolean, default: false },
    achievedStellarSupporter: { type: Boolean, default: false },
    achievedCosmicConversationalist: { type: Boolean, default: false },
    achievedGalacticPlanetologist: { type: Boolean, default: false },
    achievedCosmicObserver: { type: Boolean, default: false },
    achievedNebulaGazer: { type: Boolean, default: false },
    achievedGalacticVisionary: { type: Boolean, default: false },
    achievedAsteroidScholar: { type: Boolean, default: false },
    achievedCelestialSavant: { type: Boolean, default: false },
    achievedCosmicPersona: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
