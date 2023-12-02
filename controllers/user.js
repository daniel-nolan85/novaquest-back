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
    ).select('name');
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
    'fhaz',
    'rhaz',
    'mast',
    'chemcam',
    'mahli',
    'mardi',
    'navcam',
    'pancam',
    'minites',
    'edl_rucam',
    'edl_rdcam',
    'edl_ddcam',
    'edl_pucam1',
    'edl_pucam2',
    'navcam_left',
    'navcam_right',
    'mcz_left',
    'mcz_right',
    'front_hazcam_left_a',
    'front_hazcam_right_a',
    'rear_hazcam_left',
    'rear_hazcam_right',
    'skycam',
    'sherloc_watson',
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
