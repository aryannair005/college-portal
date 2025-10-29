const Resource = require('../models/Resource');
const Pyq = require('../models/Pyq');
const Syllabus = require('../models/Syllabus');
const validate = require('../middleware/validationMiddleware'); // Import validation middleware

exports.getResources = async (req, res) => {
    // Joi validation for query parameters
    try {
        // Validation is now handled by middleware for GET requests
        const { course, semester, subject } = req.query;
        let filter = {};

        if (course) filter.course = new RegExp(course, 'i');
        if (semester) filter.semester = semester;
        if (subject) filter.subject = new RegExp(subject, 'i');

        const resources = await Resource.find(filter).sort({ uploadedAt: -1 });

        res.render('resources', {
            title: 'Study Resources',
            resources,
            filters: { course, semester, subject }
        });
    } catch (error) {
        console.error('Error loading resources:', error);
        req.session.messages = ['Error loading resources'];
        res.render('resources', {
            title: 'Study Resources',
            resources: [],
            filters: {}
        });
    }
};

exports.getPyqs = async (req, res) => {
    // Joi validation for query parameters
    try {
        const { course, semester, subject } = req.query;
        let filter = {};

        if (course) filter.course = new RegExp(course, 'i');
        if (semester) filter.semester = semester;
        if (subject) filter.subject = new RegExp(subject, 'i');

        const pyqs = await Pyq.find(filter).sort({ uploadedAt: -1 });

        res.render('browse-pyqs', {
            title: 'Previous Year Questions',
            pyqs,
            filters: { course, semester, subject }
        });
    } catch (error) {
        console.error('Error loading PYQs:', error);
        req.session.messages = ['Error loading PYQs'];
        res.render('browse-pyqs', {
            title: 'Previous Year Questions',
            pyqs: [],
            filters: {}
        });
    }
};

exports.getSyllabus = async (req, res) => {
    // Joi validation for query parameters
    try {
        const { course, semester, subject } = req.query;
        let filter = {};

        if (course) filter.course = new RegExp(course, 'i');
        if (semester) filter.semester = semester;
        if (subject) filter.subject = new RegExp(subject, 'i');

        const syllabi = await Syllabus.find(filter).sort({ uploadedAt: -1 });

        res.render('syllabus', {
            title: 'Course Syllabus',
            syllabi,
            filters: { course, semester, subject }
        });
    } catch (error) {
        console.error('Error loading syllabus:', error);
        req.session.messages = ['Error loading syllabus'];
        res.render('syllabus', {
            title: 'Course Syllabus',
            syllabi: [],
            filters: {}
        });
    }
};

exports.getResourceDetail = async (req, res) => {
    try {
        // No body/query params here, only req.params.id which typically doesn't need Joi validation
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            req.session.messages = ['Resource not found'];
            return res.redirect('/resources');
        }

        res.render('resource-detail', {
            title: resource.title,
            resource
        });
    } catch (error) {
        console.error('Error loading resource detail:', error);
        req.session.messages = ['Error loading resource'];
        res.redirect('/resources');
    }
};