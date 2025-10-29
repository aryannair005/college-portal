const Notice = require('../models/Notice');
const path = require('path');
const fs = require('fs');

// === ADMIN FUNCTIONS ===

exports.getAdminNoticesPage = async (req, res) => {
    try {
        const notices = await Notice.find()
            .sort({ createdAt: -1 })
            .populate('createdBy', 'username');

        res.render('admin/manage-notices', {
            title: 'Manage Notices',
            notices
        });
    } catch (error) {
        console.error('Error loading notices for admin:', error);
        req.session.messages = ['Error loading notices'];
        res.render('admin/manage-notices', {
            title: 'Manage Notices',
            notices: []
        });
    }
};

exports.getAddNoticePage = (req, res) => {
    res.render('admin/add-notice', { title: 'Add Notice' });
};

exports.postAddNotice = async (req, res) => {
    // Joi validation handled by middleware
    try {
        const { title, description, priority } = req.body;

        const notice = new Notice({
            title,
            description,
            priority: priority || 'medium',
            createdBy: req.session.userId,
            createdByName: req.session.username,
            image: req.file ? req.file.filename : null
        });

        await notice.save();
        req.session.messages = ['Notice added successfully'];
        res.redirect('/admin/notices');
    } catch (error) {
        console.error('Error adding notice:', error);
        req.session.messages = ['Error adding notice'];
        res.redirect('/admin/add-notice');
    }
};

exports.deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);

        if (!notice) {
            req.session.messages = ['Notice not found'];
            return res.redirect('/admin/notices');
        }

        // Delete associated image if it exists
        if (notice.image) {
            const imagePath = path.join(__dirname, '../uploads/notices', notice.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Notice.findByIdAndDelete(req.params.id);
        req.session.messages = ['Notice deleted successfully'];
        res.redirect('/admin/notices');
    } catch (error) {
        console.error('Error deleting notice:', error);
        req.session.messages = ['Error deleting notice'];
        res.redirect('/admin/notices');
    }
};

exports.toggleNoticeStatus = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);

        if (!notice) {
            req.session.messages = ['Notice not found'];
            return res.redirect('/admin/notices');
        }

        notice.isActive = !notice.isActive;
        await notice.save();

        req.session.messages = [`Notice ${notice.isActive ? 'activated' : 'deactivated'} successfully`];
        res.redirect('/admin/notices');
    } catch (error) {
        console.error('Error toggling notice status:', error);
        req.session.messages = ['Error updating notice status'];
        res.redirect('/admin/notices');
    }
};

// === STUDENT FUNCTIONS ===

exports.getNoticesPage = async (req, res) => {
    try {
        // Only show active notices
        const notices = await Notice.find({ isActive: true })
            .sort({ priority: -1, createdAt: -1 }) // Sort by priority first, then by date
            .populate('createdBy', 'username');

        res.render('notices', {
            title: 'Notice Board',
            notices
        });
    } catch (error) {
        console.error('Error loading notices:', error);
        req.session.messages = ['Error loading notices'];
        res.render('notices', {
            title: 'Notice Board',
            notices: []
        });
    }
};

exports.getSingleNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id)
            .populate('createdBy', 'username');

        if (!notice) {
            req.session.messages = ['Notice not found'];
            return res.redirect('/notices');
        }

        // For students, only show active notices
        if (req.session.userRole !== 'admin' && !notice.isActive) {
            req.session.messages = ['Notice not available'];
            return res.redirect('/notices');
        }

        res.render('notice-detail', {
            title: notice.title,
            notice
        });
    } catch (error) {
        console.error('Error loading notice detail:', error);
        req.session.messages = ['Error loading notice'];
        res.redirect('/notices');
    }
};