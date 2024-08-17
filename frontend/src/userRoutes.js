const express = require('express');
const User = require('./models/User');

const router = express.Router();

router.post('/api/register', async (req, res) => {
    try {
        console.log('Received registration request:', req.body);

        const { username, email, password } = req.body;

        // Validate the request data (add more validation as needed)

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', existingUser);
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create a new user
        const newUser = new User({ name: username, email, password });
        await newUser.save();

        console.log('User registered successfully:', newUser);
        res.status(201).json({ user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
