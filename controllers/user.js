const User = require('../models/user');
const Leaderboard = require('../models/leaderboard');

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
    ).select('name');
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.awardXP = async (req, res) => {
  const { _id, xp } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { _id },
      { $inc: { xp } },
      { new: true }
    ).select('xp rank');
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
    ).select(badge);
    res.json(user);
  } catch (error) {
    console.error('Error unlocking badge:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// this function has not yet been tested!!
exports.promoteUser = async (req, res) => {
  const { _id, rank } = req.body;
  console.log('promoteUser => ', _id, rank);
  try {
    const user = await User.findOneAndUpdate(
      { _id },
      { $set: { rank } },
      { new: true }
    ).select('rank');
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
    ).select(textSpeed);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateViewedRovers = async (req, res) => {
  const { _id, rover, camera, dateType } = req.body;
  const allRovers = ['curiosity', 'opportunity', 'perseverance', 'spirit'];
  const allCameras = [
    'FHAZ',
    'RHAZ',
    'MAST',
    'CHEMCAM',
    'MAHLI',
    'MARDI',
    'NAVCAM',
    'PANCAM',
    'MINITES',
    'EDL_RUCAM',
    'EDL_RDCAM',
    'EDL_DDCAM',
    'EDL_PUCAM1',
    'EDL_PUCAM2',
    'NAVCAM_LEFT',
    'NAVCAM_RIGHT',
    'MCZ_RIGHT',
    'MCZ_LEFT',
    'FRONT_HAZCAM_LEFT_A',
    'FRONT_HAZCAM_RIGHT_A',
    'REAR_HAZCAM_LEFT',
    'REAR_HAZCAM_RIGHT',
    'SKYCAM',
    'SHERLOC_WATSON',
  ];
  const allDateTypes = ['sol', 'earth_date'];

  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        $addToSet: {
          viewedRovers: rover,
          viewedRoverCameras: camera,
          viewedRoverDateTypes: dateType,
        },
      },
      { new: true }
    ).select(
      'viewedRovers viewedRoverCameras viewedRoverDateTypes achievedRedPlanetVoyager achievedMarsRoverMaestro achievedCosmicChronologist achievedMartianLensMaster'
    );

    const isFirstRover = user.viewedRovers.length === 1;
    const hasViewedAllRovers = allRovers.every((rover) =>
      user.viewedRovers.includes(rover)
    );
    const hasViewedAllCameras = allCameras.every((camera) =>
      user.viewedRoverCameras.includes(camera)
    );
    const hasViewedAllDateTypes = allDateTypes.every((dateType) =>
      user.viewedRoverDateTypes.includes(dateType)
    );

    let achievements = [];

    if (isFirstRover && user.achievedRedPlanetVoyager !== true) {
      achievements.push('MarsRoverOneComplete');
    }
    if (hasViewedAllRovers && user.achievedMarsRoverMaestro !== true) {
      achievements.push('MarsRoverAllComplete');
    }
    if (hasViewedAllCameras && user.achievedMartianLensMaster !== true) {
      achievements.push('MarsRoverAllCamerasComplete');
    }
    if (hasViewedAllDateTypes && user.achievedCosmicChronologist !== true) {
      achievements.push('MarsRoverAllDateTypesComplete');
    }

    if (achievements.length > 1) {
      res.json({ user, simultaneousAchievements: achievements });
    } else if (achievements.length === 1) {
      res.json({ user, achievement: achievements[0] });
    } else {
      res.json({ user, noAchievements: true });
    }
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.checkTriviaAchievements = async (req, res) => {
  const { _id, score, level, questionsAmount } = req.body;

  try {
    const user = await User.findById(_id).select(
      'achievedCosmicCadet achievedStarNavigator achievedGalacticSage achievedNovaScholar achievedQuasarVirtuoso achievedSupernovaSavant achievedLightSpeedExplorer achievedOdysseyTrailblazer achievedInfinityVoyager'
    );

    const maxPossibleScore = questionsAmount * 10;
    const scorePercentage = (score / maxPossibleScore) * 100;

    const achievements = [];

    if (scorePercentage > 50) {
      if (level === 'easy' && !user.achievedCosmicCadet) {
        achievements.push('TriviaEasyScoreOver50');
        user.achievedCosmicCadet = true;
      } else if (level === 'medium' && !user.achievedStarNavigator) {
        achievements.push('TriviaMediumScoreOver50');
        user.achievedStarNavigator = true;
      } else if (level === 'hard' && !user.achievedGalacticSage) {
        achievements.push('TriviaHardScoreOver50');
        user.achievedGalacticSage = true;
      }
    }

    if (score === maxPossibleScore) {
      if (level === 'easy' && !user.achievedNovaScholar) {
        achievements.push('TriviaPerfectEasy');
        user.achievedNovaScholar = true;
      } else if (level === 'medium' && !user.achievedQuasarVirtuoso) {
        achievements.push('TriviaPerfectMedium');
        user.achievedQuasarVirtuoso = true;
      } else if (level === 'hard' && !user.achievedSupernovaSavant) {
        achievements.push('TriviaPerfectHard');
        user.achievedSupernovaSavant = true;
      }
    }

    if (questionsAmount === 10 && !user.achievedLightSpeedExplorer) {
      achievements.push('TriviaComplete10Question');
      user.achievedLightSpeedExplorer = true;
    } else if (questionsAmount === 20 && !user.achievedOdysseyTrailblazer) {
      achievements.push('TriviaComplete20Question');
      user.achievedOdysseyTrailblazer = true;
    } else if (questionsAmount === 30 && !user.achievedInfinityVoyager) {
      achievements.push('TriviaComplete30Question');
      user.achievedInfinityVoyager = true;
    }

    await user.save();
    if (achievements.length > 1) {
      res.json({ user, simultaneousAchievements: achievements });
    } else if (achievements.length === 1) {
      res.json({ user, achievement: achievements[0] });
    } else {
      res.json({ user, noAchievements: true });
    }
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.fetchThisUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId).select(
      'profileImage name rank bio daysInSpace'
    );
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.followMember = async (req, res) => {
  const { _id, userId } = req.body;
  try {
    const currentUser = await User.findByIdAndUpdate(
      _id,
      {
        $addToSet: {
          allies: userId,
        },
      },
      { new: true }
    ).select('allies');
    const otherUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          explorers: _id,
        },
      },
      { new: true }
    );
    res.json(currentUser);
  } catch (error) {
    console.error('Error following user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.unfollowMember = async (req, res) => {
  const { _id, userId } = req.body;
  try {
    const currentUser = await User.findByIdAndUpdate(
      _id,
      {
        $pull: {
          allies: userId,
        },
      },
      { new: true }
    ).select('allies');
    const otherUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          explorers: _id,
        },
      },
      { new: true }
    );
    res.json(currentUser);
  } catch (error) {
    console.error('Error unfollowing user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllies = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId)
      .select('allies')
      .populate('allies', '_id profileImage name rank');
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getExplorers = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId)
      .select('explorers')
      .populate('explorers', '_id profileImage name rank');
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateProfileWithImage = async (req, res) => {
  const { _id, name, bio, profileImage } = req.body;
  try {
    const data = {};
    if (name) {
      data.name = name;
    }
    if (bio) {
      data.bio = bio;
    }
    if (profileImage) {
      data.profileImage = profileImage;
    }
    const user = await User.findByIdAndUpdate(_id, data, {
      new: true,
    }).select(`name bio profileImage`);
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateProfile = async (req, res) => {
  const { _id, name, bio } = req.body;
  try {
    const data = {};
    if (name) {
      data.name = name;
    }
    if (bio) {
      data.bio = bio;
    }
    const user = await User.findByIdAndUpdate(_id, data, {
      new: true,
    }).select(`name bio`);
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.usersAchievements = async (req, res) => {
  const { _id } = req.body;
  try {
    const achievements = await User.findById(_id).select(
      'achievedCosmicPioneer achievedAdventurousExplorer achievedStellarVoyager achievedAstroPioneer achievedCosmicTrailblazer achievedCelestialNomad achievedGalacticWayfarer achievedInterstellarVoyager achievedStellarCenturion achievedVoyagerExtraordinaire achievedRedPlanetVoyager achievedMarsRoverMaestro achievedMartianLensMaster achievedCosmicChronologist achievedCosmicCadet achievedStarNavigator achievedGalacticSage achievedNovaScholar achievedQuasarVirtuoso achievedSupernovaSavant achievedLightSpeedExplorer achievedOdysseyTrailblazer achievedInfinityVoyager achievedCelestialCadet achievedAstroAce achievedGalacticAviator achievedCosmicArranger achievedCelestialContributor achievedProlificExplorer achievedGalaxyLuminary achievedCosmicChronicler achievedStellarSupporter achievedCosmicConversationalist achievedGalacticPlanetologist'
    );
    res.json(achievements);
  } catch (err) {
    console.error('Error retrieving achievements:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.blockUser = async (req, res) => {
  const { _id, userId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        $addToSet: {
          blockeds: userId,
        },
      },
      { new: true }
    ).select('blockeds');
    res.json(user);
  } catch (error) {
    console.error('Error blocking user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.incrementNotifsCount = async (req, res) => {
  const { _id, userId, message } = req.body;
  try {
    const { rank, name } = await User.findById(userId).select('rank name');
    const timestamp = new Date().toISOString();
    const notificationMessage = `${rank} ${name} ${message}`;
    const user = await User.findByIdAndUpdate(
      _id,
      {
        $addToSet: {
          newNotificationsCount: {
            id: timestamp,
            message: notificationMessage,
          },
        },
      },
      { new: true }
    ).select('newNotificationsCount');
    res.json(user);
  } catch (error) {
    console.error('Error incrementing notifs:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.resetNotifsCount = async (req, res) => {
  const { _id } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      { $set: { newNotificationsCount: [] } },
      { new: true }
    ).select('newNotificationsCount');
    res.json(user);
  } catch (error) {
    console.error('Error resetting notifs:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.fetchUserSignals = async (req, res) => {
  const { _id } = req.body;
  try {
    const user = await User.findById(_id)
      .select('notifications')
      .populate('notifications.user', '_id profileImage name rank');
    res.json(user);
  } catch (error) {
    console.error('Error retrieving user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.catchScore = async (req, res) => {
  const { _id, score } = req.body;
  const normalizedScore = Math.max(score, 0);
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      { $max: { highScore: normalizedScore } },
      { new: true }
    ).select(
      'highScore achievedCelestialCadet achievedAstroAce achievedGalacticAviator'
    );

    const achievements = [];

    if (normalizedScore > 499 && !user.achievedGalacticAviator) {
      if (!user.achievedCelestialCadet) {
        achievements.push('AstroScoreOver50');
        user.achievedCelestialCadet = true;
      }
      if (!user.achievedAstroAce) {
        achievements.push('AstroScoreOver100');
        user.achievedAstroAce = true;
      }
      achievements.push('AstroScoreOver500');
      user.achievedGalacticAviator = true;
    } else if (normalizedScore > 99 && !user.achievedAstroAce) {
      if (!user.achievedCelestialCadet) {
        achievements.push('AstroScoreOver50');
        user.achievedCelestialCadet = true;
      }
      achievements.push('AstroScoreOver100');
      user.achievedAstroAce = true;
    } else if (normalizedScore > 49 && !user.achievedCelestialCadet) {
      achievements.push('AstroScoreOver50');
      user.achievedCelestialCadet = true;
    }

    await user.save();

    const leaderboardEntries = await Leaderboard.find({})
      .sort({ score: -1 })
      .limit(100);
    if (
      leaderboardEntries.length < 100 ||
      normalizedScore > leaderboardEntries[99].score
    ) {
      const newLeaderboardEntry = new Leaderboard({
        player: _id,
        score: normalizedScore,
      });
      await newLeaderboardEntry.save();
      if (leaderboardEntries.length === 100) {
        await Leaderboard.findByIdAndDelete(leaderboardEntries[99]._id);
      }
    }
    if (achievements.length > 1) {
      res.json({ user, simultaneousAchievements: achievements });
    } else if (achievements.length === 1) {
      res.json({ user, achievement: achievements[0] });
    } else {
      res.json({ user, noAchievements: true });
    }
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.awardAchievement = async (req, res) => {
  const { _id, achievement } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      { $set: { [achievement]: true } },
      { new: true }
    ).select(achievement);
    res.json(user);
  } catch (error) {
    console.error('Error awarding achievement:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateViewedPlanets = async (req, res) => {
  const { _id, name } = req.body;
  const allPlanets = [
    'mercury',
    'venus',
    'earth',
    'mars',
    'ceres',
    'jupiter',
    'saturn',
    'uranus',
    'neptune',
    'pluto',
    'haumea',
    'makemake',
    'eris',
  ];

  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        $addToSet: { viewedPlanets: name },
      },
      { new: true }
    ).select('viewedPlanets achievedGalacticPlanetologist');

    const hasViewedAllPlanets = allPlanets.every((name) =>
      user.viewedPlanets.includes(name)
    );

    let achievement = '';

    if (hasViewedAllPlanets && !user.achievedGalacticPlanetologist) {
      achievement = 'PlanetsAllComplete';
    }

    res.json({ user, achievement });
  } catch (error) {
    console.error('Error updating planets:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
