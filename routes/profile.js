// routes/profile.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');
const path = require("path");
const router = express.Router();

// Multer setup for profile picture upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Upload or update profile picture
router.post('/profile-picture', [authenticate, upload.single('profilePicture')], async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.profilePicture) {
      fs.unlinkSync(user.profilePicture); // Delete old profile picture
    }
    user.profilePicture = req.file.path;
    await user.save();

    res.send('Profile picture updated');
  } catch (err) {
    res.status(500).send('Error uploading profile picture');
  }
});

router.delete('/profile-picture', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.profilePicture) {
      return res.status(404).send("Profile picture not found");
    }

    // Delete the profile picture file from the filesystem
    fs.unlinkSync(user.profilePicture);

    // Remove the profilePicture path from the database
    user.profilePicture = null;
    await user.save();

    res.send("Profile picture deleted successfully");
  } catch (err) {
    console.error("Error deleting profile picture:", err);
    res.status(500).send("Error deleting profile picture");
  }
});
// Get user profile
router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
  } catch (err) {
    res.status(500).send('Error fetching profile');
  }
});

router.get('/profile-picture', authenticate, async (req, res) => {
  try {
    // Fetch the user from the database
    const user = await User.findById(req.user._id);

    // Check if the user and profile picture exist
    if (!user || !user.profilePicture) {
      return res.status(404).send("Profile picture not found");
    }

    const profilePicturePath = path.resolve(user.profilePicture);

    // Check if the file exists on the server
    if (!fs.existsSync(profilePicturePath)) {
      console.error("File not found:", profilePicturePath);
      return res.status(404).send("Profile picture file does not exist");
    }

    // Log the paths for debugging
    console.log("Profile picture path from DB:", user.profilePicture);
    console.log("Resolved path:", profilePicturePath);

    // Send the profile picture file as a response
    res.sendFile(profilePicturePath);
  } catch (err) {
    console.error("Error fetching profile picture:", err);
    res.status(500).send("Error fetching profile picture");
  }
});

module.exports = router;