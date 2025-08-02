const express = require('express');
const router = express.Router();
const { ensureStudent } = require('../middleware/authMiddleware');
const studentController = require('../controllers/studentController');
const validate = require('../middleware/validationMiddleware'); // Import validation middleware

// Student Dashboard (already in index router, but keeping structure for completeness)
router.get('/dashboard', ensureStudent, require('../controllers/dashboardController').getDashboard);

// Resources
router.get('/resources', ensureStudent, validate('studentQuerySchema', 'query'), studentController.getResources); // Add validation for query params
router.get('/resources/:id', ensureStudent, studentController.getResourceDetail);
router.get('/view-resource-pdf/:filename', ensureStudent, require('../controllers/utilityController').viewResourcePdf);
router.get('/download-resource/:filename', ensureStudent, require('../controllers/utilityController').downloadResource);

// PYQs
router.get('/pyqs', ensureStudent, validate('studentQuerySchema', 'query'), studentController.getPyqs); // Add validation for query params
router.get('/view-pyq-pdf/:filename', ensureStudent, require('../controllers/utilityController').viewPyqPdf);
router.get('/download-pyq/:filename', ensureStudent, require('../controllers/utilityController').downloadPyq);

// Syllabus
router.get('/syllabus', ensureStudent, validate('studentQuerySchema', 'query'), studentController.getSyllabus); // Add validation for query params
router.get('/view-syllabus-pdf/:filename', ensureStudent, require('../controllers/utilityController').viewSyllabusPdf);
router.get('/download-syllabus/:filename', ensureStudent, require('../controllers/utilityController').downloadSyllabus);

// Notices 
router.get('/notices', ensureStudent, require('../controllers/noticeController').getNoticesPage);
router.get('/notices/:id', ensureStudent, require('../controllers/noticeController').getSingleNotice);

// Calendar
router.get('/calendar', ensureStudent, require('../controllers/calendarController').getCalendarPage);

module.exports = router;