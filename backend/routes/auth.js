/* eslint-env node */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Temporary in-memory OTP store (In production use Redis)
const otps = new Map();

// 1. Send OTP
router.post('/send-otp', async (req, res) => {
    const { phone } = req.body;

    if (!phone || phone.length !== 10) {
        return res.status(400).json({ success: false, message: "Invalid phone number format" });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists with this phone number" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        otps.set(phone, otp);

        // In real life, send SMS via Twilio or SNS here
        console.log(`[MOCK SMS] OTP for ${phone} is: ${otp}`);
        res.json({ success: true, message: "OTP sent successfully", mockOtp: otp }); // Returning mockOtp just for debugging
    } catch (error) {
        console.error("Send OTP Error (Possibly DB connection):", error);
        res.status(500).json({ success: false, message: "Server error or Database connection failed." });
    }
});

// 2. Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ success: false, message: "Phone and OTP required" });
    }

    const storedOtp = otps.get(phone);
    if (!storedOtp) {
        return res.status(400).json({ success: false, message: "OTP expired or not requested" });
    }

    if (storedOtp !== otp) {
        return res.status(400).json({ success: false, message: "Invalid OTP entered" });
    }

    otps.delete(phone);
    res.json({ success: true, message: "OTP verified correctly!" });
});

// 3. Register User
router.post('/register', async (req, res) => {
    const { name, username, phone, password } = req.body;

    try {
        // Basic validation
        if (!name || !username || !phone || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ $or: [{ phone }, { username }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User with this phone or username already exists!" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User
        const newUser = new User({
            name,
            username,
            phone,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ success: true, message: "User registered successfully", user: { username, name, role: 'customer' } });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// 4. Login User
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username and password required" });
        }

        // Check for hard-coded admin
        if (username === 'admin' && password === 'admin') {
            const token = jwt.sign({ username: 'admin', role: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
            return res.json({ success: true, token, user: { username: 'admin', role: 'admin', name: 'App Admin' } });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid username or password" });
        }

        // Sign Token
        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.json({ success: true, token, user: { username: user.username, name: user.name, role: user.role } });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
