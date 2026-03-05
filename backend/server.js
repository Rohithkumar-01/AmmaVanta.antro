/* eslint-env node */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const aiRoutes = require('./routes/ai');

dotenv.config();

const app = express();

const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Main Root endpoint checks if API responds
app.get('/', (req, res) => {
    res.json({ success: true, message: "Welcome to AmmaVanta Root!" });
});

app.get('/api', (req, res) => {
    res.json({ success: true, message: "Welcome to AmmaVanta Backend API!" });
});

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/ai', aiRoutes);

// Global Error Handler to ensure JSON responses
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB Connected successfully!');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (without DB)`));
    });
