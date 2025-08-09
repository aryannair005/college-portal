const Feedback = require('../models/Feedback');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Student Routes
exports.getAddFeedbackPage = (req, res) => {
    res.render('feedback/add', { title: 'Submit Feedback' });
};

exports.postAddFeedback = async (req, res) => {
    try {
        const { title, message, category, priority, rating, isAnonymous } = req.body;

        const feedback = new Feedback({
            title,
            message,
            category,
            priority: priority || 'medium',
            rating: rating ? parseInt(rating) : undefined,
            isAnonymous: isAnonymous === 'true',
            submittedBy: req.session.userId,
            submittedByName: isAnonymous === 'true' ? 'Anonymous' : req.session.username
        });

        // Handle file attachments if any
        if (req.file) {
            feedback.attachments.push({
                filename: req.file.filename,
                originalName: req.file.originalname
            });
        }

        await feedback.save();
        req.session.messages = ['Feedback submitted successfully! We appreciate your input.'];
        res.redirect('/feedback/add');
    } catch (error) {
        console.error('Error submitting feedback:', error);
        req.session.messages = ['Error submitting feedback. Please try again.'];
        res.redirect('/feedback/add');
    }
};

exports.getMyFeedback = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const feedbacks = await Feedback.find({ submittedBy: req.session.userId })
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Feedback.countDocuments({ submittedBy: req.session.userId });
        const totalPages = Math.ceil(total / limit);

        res.render('feedback/my-feedback', {
            title: 'My Feedback',
            feedbacks,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1
        });
    } catch (error) {
        console.error('Error loading user feedback:', error);
        req.session.messages = ['Error loading feedback'];
        res.render('feedback/my-feedback', {
            title: 'My Feedback',
            feedbacks: [],
            currentPage: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
            nextPage: 1,
            prevPage: 1
        });
    }
};

exports.getFeedbackDetail = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id)
            .populate('submittedBy', 'username')
            .populate('reviewedBy', 'username');

        if (!feedback) {
            req.session.messages = ['Feedback not found'];
            return res.redirect('/feedback/my-feedback');
        }

        // Check if user owns this feedback (unless admin)
        if (req.session.userRole !== 'admin' && feedback.submittedBy._id.toString() !== req.session.userId) {
            req.session.messages = ['Unauthorized access to feedback'];
            return res.redirect('/feedback/my-feedback');
        }

        res.render('feedback/detail', {
            title: 'Feedback Details',
            feedback
        });
    } catch (error) {
        console.error('Error loading feedback detail:', error);
        req.session.messages = ['Error loading feedback details'];
        res.redirect('/feedback/my-feedback');
    }
};

// Admin Routes
exports.getAdminFeedbackPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const skip = (page - 1) * limit;
        const status = req.query.status || 'all';
        const category = req.query.category || 'all';
        const priority = req.query.priority || 'all';

        // Build query
        const query = {};
        if (status !== 'all') query.status = status;
        if (category !== 'all') query.category = category;
        if (priority !== 'all') query.priority = priority;

        const feedbacks = await Feedback.find(query)
            .populate('submittedBy', 'username email')
            .populate('reviewedBy', 'username')
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Feedback.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        // Get statistics
        const stats = await Feedback.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const statusStats = {
            pending: 0,
            reviewed: 0,
            resolved: 0,
            closed: 0
        };

        stats.forEach(stat => {
            statusStats[stat._id] = stat.count;
        });

        res.render('admin/manage-feedback', {
            title: 'Manage Feedback',
            feedbacks,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1,
            statusStats,
            filters: { status, category, priority }
        });
    } catch (error) {
        console.error('Error loading admin feedback:', error);
        req.session.messages = ['Error loading feedback'];
        res.render('admin/manage-feedback', {
            title: 'Manage Feedback',
            feedbacks: [],
            currentPage: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
            nextPage: 1,
            prevPage: 1,
            statusStats: { pending: 0, reviewed: 0, resolved: 0, closed: 0 },
            filters: { status: 'all', category: 'all', priority: 'all' }
        });
    }
};

exports.updateFeedbackStatus = async (req, res) => {
    try {
        const { status, adminResponse } = req.body;
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            req.session.messages = ['Feedback not found'];
            return res.redirect('/admin/feedback');
        }

        feedback.status = status;
        feedback.reviewedBy = req.session.userId;
        feedback.reviewedByName = req.session.username;
        feedback.reviewedAt = new Date();

        if (adminResponse && adminResponse.trim()) {
            feedback.adminResponse = {
                message: adminResponse.trim(),
                respondedAt: new Date()
            };
        }

        await feedback.save();
        req.session.messages = ['Feedback status updated successfully'];
        res.redirect('/admin/feedback');
    } catch (error) {
        console.error('Error updating feedback status:', error);
        req.session.messages = ['Error updating feedback status'];
        res.redirect('/admin/feedback');
    }
};

exports.deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            req.session.messages = ['Feedback not found'];
            return res.redirect('/admin/feedback');
        }

        // Delete any attached files
        if (feedback.attachments && feedback.attachments.length > 0) {
            feedback.attachments.forEach(attachment => {
                const filepath = path.join(__dirname, '../uploads/feedback', attachment.filename);
                if (fs.existsSync(filepath)) {
                    fs.unlinkSync(filepath);
                }
            });
        }

        await Feedback.findByIdAndDelete(req.params.id);
        req.session.messages = ['Feedback deleted successfully'];
        res.redirect('/admin/feedback');
    } catch (error) {
        console.error('Error deleting feedback:', error);
        req.session.messages = ['Error deleting feedback'];
        res.redirect('/admin/feedback');
    }
};

exports.exportFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({})
            .populate('submittedBy', 'username email')
            .populate('reviewedBy', 'username')
            .sort({ submittedAt: -1 });

        // Simple CSV export
        let csv = 'Title,Message,Category,Priority,Status,Submitted By,Submitted At,Rating\n';
        
        feedbacks.forEach(feedback => {
            const row = [
                `"${feedback.title.replace(/"/g, '""')}"`,
                `"${feedback.message.replace(/"/g, '""')}"`,
                feedback.category,
                feedback.priority,
                feedback.status,
                feedback.isAnonymous ? 'Anonymous' : feedback.submittedByName,
                feedback.submittedAt.toISOString().split('T')[0],
                feedback.rating || ''
            ];
            csv += row.join(',') + '\n';
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="feedback-export.csv"');
        res.send(csv);
    } catch (error) {
        console.error('Error exporting feedback:', error);
        req.session.messages = ['Error exporting feedback'];
        res.redirect('/admin/feedback');
    }
};

// Utility function to serve feedback attachments
exports.downloadFeedbackAttachment = (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../uploads/feedback', filename);

    if (fs.existsSync(filepath)) {
        res.download(filepath);
    } else {
        res.status(404).send('File not found');
    }
};