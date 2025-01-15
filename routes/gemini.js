const express = require('express');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');
const dotenv = require('dotenv');
const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  const { prompt} = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required and must be a string' });
  }

  try {
    console.log("Processing prompt,response:", prompt,);
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.prompts.push({ prompt});
    await user.save();

    res.status(200).json({ prompt, message: 'Prompt saved successfully' });
  } catch (error) {
    console.error("Error saving prompt:", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Add the following GET route to fetch the user's prompts

router.get('/prompts', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ prompts: user.prompts });
  } catch (error) {
    console.error("Error fetching prompts:", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete a specific prompt
router.delete('/prompts/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const promptIndex = user.prompts.findIndex(p => p._id.toString() === id);
    if (promptIndex === -1) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    user.prompts.splice(promptIndex, 1);
    await user.save();

    res.status(200).json({ message: 'Prompt deleted successfully' });
  } catch (error) {
    console.error("Error deleting prompt:", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;