const Doubt = require('../models/Doubt');

exports.getDashboard = async (req, res) => {
    try {
        const recentDoubts = await Doubt.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('postedBy', 'username');

        res.render('dashboard', {
            title: 'Dashboard',
            recentDoubts
        });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        req.session.messages = ['Error loading dashboard data'];
        res.render('dashboard', {
            title: 'Dashboard',
            recentDoubts: []
        });
    }
};