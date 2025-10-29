const Doubt = require('../models/Doubt');
const path = require('path');
const fs = require('fs');

exports.getDoubts = async (req, res) => {
    try {
        const doubts = await Doubt.find()
            .sort({ createdAt: -1 })
            .populate('postedBy', 'username');

        res.render('doubts', {
            title: 'Doubts & Discussion',
            doubts
        });
    } catch (error) {
        console.error('Error loading doubts:', error);
        req.session.messages = ['Error loading doubts'];
        res.render('doubts', {
            title: 'Doubts & Discussion',
            doubts: []
        });
    }
};

exports.getAddDoubtPage = (req, res) => {
    res.render('add-doubt', { title: 'Post Your Doubt' });
};

exports.postAddDoubt = async (req, res) => {
    // Joi validation handled by middleware
    try {
        const { title, description, course, semester, subject } = req.body;

        const doubt = new Doubt({
            title,
            description,
            course,
            semester,
            subject,
            postedBy: req.session.userId,
            postedByName: req.session.username,
            image: req.file ? req.file.filename : null
        });

        await doubt.save();
        req.session.messages = ['Doubt posted successfully!'];
        res.redirect('/doubts');
    } catch (error) {
        console.error('Error posting doubt:', error);
        req.session.messages = ['Error posting doubt'];
        res.redirect('/doubts/add');
    }
};

exports.getSingleDoubt = async (req, res) => {
    try {
        const doubt = await Doubt.findById(req.params.id)
            .populate('postedBy', 'username')
            .populate('replies.repliedBy', 'username');

        if (!doubt) {
            req.session.messages = ['Doubt not found'];
            return res.redirect('/doubts');
        }

        res.render('doubt-detail', {
            title: doubt.title,
            doubt
        });
    } catch (error) {
        console.error('Error loading single doubt:', error);
        req.session.messages = ['Error loading doubt'];
        res.redirect('/doubts');
    }
};

exports.postReplyToDoubt = async (req, res) => {
    // Joi validation handled by middleware
    try {
        const { message } = req.body;
        const doubt = await Doubt.findById(req.params.id);

        if (!doubt) {
            req.session.messages = ['Doubt not found'];
            return res.redirect('/doubts');
        }

        doubt.replies.push({
            message,
            repliedBy: req.session.userId,
            repliedByName: req.session.username
        });

        await doubt.save();
        req.session.messages = ['Reply added successfully!'];
        res.redirect(`/doubts/${req.params.id}`);
    } catch (error) {
        console.error('Error adding reply:', error);
        req.session.messages = ['Error adding reply'];
        res.redirect(`/doubts/${req.params.id}`);
    }
};

exports.postMarkDoubtAsSolved = async (req, res) => {
    try {
        const doubt = await Doubt.findById(req.params.id);

        if (!doubt) {
            req.session.messages = ['Doubt not found'];
            return res.redirect('/doubts');
        }

        if (doubt.postedBy.toString() !== req.session.userId && req.session.userRole !== 'admin') {
            req.session.messages = ['You can only delete your own doubts'];
            return res.redirect(`/doubts/${req.params.id}`);
        }

        if (doubt.image) {
            const imagePath = path.join(__dirname, '../uploads/doubts', doubt.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Doubt.findByIdAndDelete(req.params.id);

        req.session.messages = ['Doubt deleted successfully!'];
        res.redirect('/doubts');
    } catch (error) {
        console.error('Error deleting doubt:', error);
        req.session.messages = ['Error deleting doubt'];
        res.redirect(`/doubts/${req.params.id}`);
    }
};