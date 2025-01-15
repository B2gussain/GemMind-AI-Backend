// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profilePicture: String,
  prompts: [
    {
      prompt: String,
      response: String,
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
