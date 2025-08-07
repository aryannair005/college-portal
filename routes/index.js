const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Add this import

// Home Route
router.get('/', async (req, res) => {
    try {
        // Get total user count
        const totalUsers = await User.countDocuments();
        
        res.render('index', { 
            title: 'College Portal',
            totalUsers // Pass the count to the view
        });
    } catch (error) {
        console.error('Error loading home page:', error);
        res.render('index', { 
            title: 'College Portal',
            totalUsers: 0 // Default value on error
        });
    }
});

module.exports = router;