// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true 
  },
  password: { type: String, required: true },
  profilePicture: String,
  prompts: [
    {
      prompt: String,
      response: String,
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
