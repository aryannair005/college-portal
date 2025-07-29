const Resource = require('../models/Resource');
const Pyq = require('../models/Pyq');
const Syllabus = require('../models/Syllabus');
const { isValidYouTubeUrl } = require('../utils/youtubeUtils'); // This utility function is still useful for additional checks
const path = require('path');
const fs = require('fs');

exports.getAdminDashboard = (req, res) => {
    res.render('admin/dashboard', { title: 'Admin Dashboard' });
};

// --- Resource Management ---
exports.getAddResourcePage = (req, res) => {
    res.render('admin/add-resource', { title: 'Add Resource' });
};

exports.postAddResource = async (req, res) => {
    // Joi validation handled by middleware
    try {
        const { title, course, semester, subject, type, url } = req.body;

        if (type === 'pdf' && !req.file) {
            req.session.messages = ['Please upload a PDF file for PDF resource type.'];
            return res.redirect('/admin/add-resource');
        }
        if (type === 'link' && (!url || !url.startsWith('http'))) { // Basic check, Joi schema has uri validation
             req.session.messages = ['Please provide a valid URL for link resource type.'];
             return res.redirect('/admin/add-resource');
        }


        const resource = new Resource({
            title,
            course,
            semester,
            subject,
            type
        });

        if (type === 'pdf' && req.file) {
            resource.filename = req.file.filename;
        } else if (type === 'link') {
            resource.url = url;
        }

        await resource.save();
        req.session.messages = ['Resource added successfully'];
        res.redirect('/admin/add-resource');
    } catch (error) {
        console.error('Error adding resource:', error);
        req.session.messages = ['Error adding resource'];
        res.redirect('/admin/add-resource');
    }
};

exports.getManageResources = async (req, res) => {
    try {
        const resources = await Resource.find().sort({ uploadedAt: -1 });
        res.render('admin/manage-resources', {
            title: 'Manage Resources',
            resources
        });
    } catch (error) {
        console.error('Error loading resources for admin:', error);
        req.session.messages = ['Error loading resources'];
        res.render('admin/manage-resources', {
            title: 'Manage Resources',
            resources: []
        });
    }
};

exports.deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            req.session.messages = ['Resource not found'];
            return res.redirect('/admin/manage-resources');
        }

        if (resource.filename) {
            const filepath = path.join(__dirname, '../uploads/resources', resource.filename);
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }

        await Resource.findByIdAndDelete(req.params.id);

        req.session.messages = ['Resource and all associated YouTube links deleted successfully'];
        res.redirect('/admin/manage-resources');
    } catch (error) {
        console.error('Error deleting resource:', error);
        req.session.messages = ['Error deleting resource'];
        res.redirect('/admin/manage-resources');
    }
};

exports.getManageResourceDetail = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            req.session.messages = ['Resource not found'];
            return res.redirect('/admin/manage-resources');
        }

        res.render('admin/manage-resource', {
            title: 'Manage Resource',
            resource
        });
    } catch (error) {
        console.error('Error loading resource for management:', error);
        req.session.messages = ['Error loading resource'];
        res.redirect('/admin/manage-resources');
    }
};

exports.addYoutubeLink = async (req, res) => {
    // Joi validation handled by middleware
    try {
        const { topicName, url } = req.body;
        const resourceId = req.params.resourceId;

        const resource = await Resource.findById(resourceId);
        if (!resource) {
            req.session.messages = ['Resource not found'];
            return res.redirect('/admin/manage-resources');
        }

        const existingLink = resource.youtubeLinks.find(link => link.url === url);
        if (existingLink) {
            req.session.messages = ['This YouTube URL is already added to this resource'];
            return res.redirect(`/admin/manage-resource/${resourceId}`);
        }

        resource.youtubeLinks.push({
            topicName: topicName.trim(),
            url: url.trim()
        });

        await resource.save();
        req.session.messages = [`YouTube link "${topicName}" added successfully`];
        res.redirect(`/admin/manage-resource/${resourceId}`);

    } catch (error) {
        console.error('Error adding YouTube link:', error);
        req.session.messages = ['Error adding YouTube link'];
        res.redirect(`/admin/manage-resource/${req.params.resourceId}`);
    }
};

exports.removeYoutubeLink = async (req, res) => {
    try {
        const { resourceId, linkId } = req.params;

        const resource = await Resource.findById(resourceId);
        if (!resource) {
            req.session.messages = ['Resource not found'];
            return res.redirect('/admin/manage-resources');
        }

        resource.youtubeLinks = resource.youtubeLinks.filter(
            link => link._id.toString() !== linkId
        );

        await resource.save();
        req.session.messages = ['YouTube link removed successfully'];
        res.redirect(`/admin/manage-resource/${resourceId}`);
    } catch (error) {
        console.error('Error removing YouTube link:', error);
        req.session.messages = ['Error removing YouTube link'];
        res.redirect(`/admin/manage-resource/${req.params.resourceId}`);
    }
};

exports.bulkAddYoutubeLinks = async (req, res) => {
    // Joi validation handled by middleware
    try {
        const { links } = req.body; // Expecting an array of {topicName, url} objects
        const resourceId = req.params.resourceId;

        const resource = await Resource.findById(resourceId);
        if (!resource) {
            req.session.messages = ['Resource not found'];
            return res.redirect('/admin/manage-resources');
        }

        let addedCount = 0;
        let errorCount = 0;

        for (let link of links) {
            // Joi already validates structure and URL, so we just need to check for duplicates
            const exists = resource.youtubeLinks.find(existing => existing.url === link.url);
            if (!exists) {
                resource.youtubeLinks.push({
                    topicName: link.topicName.trim(),
                    url: link.url.trim()
                });
                addedCount++;
            } else {
                errorCount++;
            }
        }

        await resource.save();

        let message = `Added ${addedCount} YouTube links successfully`;
        if (errorCount > 0) {
            message += `, ${errorCount} links were skipped due to duplicates or invalid format`;
        }

        req.session.messages = [message];
        res.redirect(`/admin/manage-resource/${resourceId}`);

    } catch (error) {
        console.error('Error bulk adding YouTube links:', error);
        req.session.messages = ['Error adding YouTube links'];
        res.redirect('/admin/manage-resources');
    }
};


// --- PYQ Management ---
exports.getAddPyqPage = (req, res) => {
    res.render('admin/add-pyq', { title: 'Add PYQ' });
};

exports.postAddPyq = async (req, res) => {
    // Joi validation handled by middleware
    try {
        const { course, semester, subject } = req.body;

        if (!req.file) {
            req.session.messages = ['Please select a file'];
            return res.redirect('/admin/add-pyq');
        }

        const pyq = new Pyq({
            course,
            semester,
            subject,
            filename: req.file.filename,
            originalName: req.file.originalname
        });

        await pyq.save();
        req.session.messages = ['PYQ added successfully'];
        res.redirect('/admin/add-pyq');
    } catch (error) {
        console.error('Error adding PYQ:', error);
        req.session.messages = ['Error adding PYQ'];
        res.redirect('/admin/add-pyq');
    }
};

// --- Syllabus Management ---
exports.getAddSyllabusPage = (req, res) => {
    res.render('admin/add-syllabus', { title: 'Add Syllabus' });
};

exports.postAddSyllabus = async (req, res) => {
    // Joi validation handled by middleware
    try {
        const { title, course, semester, subject, description, type, url } = req.body;

        if (type === 'pdf' && !req.file) {
            req.session.messages = ['Please upload a PDF file for PDF syllabus type.'];
            return res.redirect('/admin/add-syllabus');
        }
        if (type === 'link' && (!url || !url.startsWith('http'))) {
            req.session.messages = ['Please provide a valid URL for link syllabus type.'];
            return res.redirect('/admin/add-syllabus');
        }

        const syllabus = new Syllabus({
            title,
            course,
            semester,
            subject,
            description: description || '',
            type
        });

        if (type === 'pdf' && req.file) {
            syllabus.filename = req.file.filename;
        } else if (type === 'link') {
            syllabus.url = url;
        }

        await syllabus.save();
        req.session.messages = ['Syllabus added successfully'];
        res.redirect('/admin/add-syllabus');
    } catch (error) {
        console.error('Error adding syllabus:', error);
        req.session.messages = ['Error adding syllabus'];
        res.redirect('/admin/add-syllabus');
    }
};

exports.getManageSyllabus = async (req, res) => {
    try {
        const syllabi = await Syllabus.find().sort({ uploadedAt: -1 });
        res.render('admin/manage-syllabus', {
            title: 'Manage Syllabus',
            syllabi
        });
    } catch (error) {
        console.error('Error loading syllabus for admin:', error);
        req.session.messages = ['Error loading syllabus'];
        res.render('admin/manage-syllabus', {
            title: 'Manage Syllabus',
            syllabi: []
        });
    }
};

exports.deleteSyllabus = async (req, res) => {
    try {
        const syllabus = await Syllabus.findById(req.params.id);

        if (!syllabus) {
            req.session.messages = ['Syllabus not found'];
            return res.redirect('/admin/manage-syllabus');
        }

        if (syllabus.filename) {
            const filepath = path.join(__dirname, '../uploads/resources', syllabus.filename);
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }

        await Syllabus.findByIdAndDelete(req.params.id);
        req.session.messages = ['Syllabus deleted successfully'];
        res.redirect('/admin/manage-syllabus');
    } catch (error) {
        console.error('Error deleting syllabus:', error);
        req.session.messages = ['Error deleting syllabus'];
        res.redirect('/admin/manage-syllabus');
    }
};