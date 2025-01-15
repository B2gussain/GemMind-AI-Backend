const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const geminiRoutes = require('./routes/gemini');
const profileRoutes = require('./routes/profile');

dotenv.config();
const app = express();
app.use(express.json());
const cors = require('cors');

app.use(cors({ origin: 'https://gemmind-ai-frontend.onrender.com' })); // Replace with your frontend URL

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error(err));

// Routes
app.use('/auth', authRoutes);
app.use('/gemini', geminiRoutes);
app.use('/profile', profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));