const express = require('express');
const router = express.Router();
const { ensureAdmin } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');
const upload = require('../config/multerConfig');
const validate = require('../middleware/validationMiddleware');

// Admin Dashboard
router.get('/', ensureAdmin, adminController.getAdminDashboard);

// Resource Management
router.get('/add-resource', ensureAdmin, adminController.getAddResourcePage);
router.post('/add-resource', ensureAdmin, upload.single('pdf'), validate('addResourceSchema'), adminController.postAddResource);
router.get('/manage-resources', ensureAdmin, adminController.getManageResources);
router.post('/delete-resource/:id', ensureAdmin, adminController.deleteResource);
router.get('/manage-resource/:id', ensureAdmin, adminController.getManageResourceDetail);
router.post('/add-youtube-link/:resourceId', ensureAdmin, validate('addYoutubeLinkSchema'), adminController.addYoutubeLink);
router.post('/remove-youtube-link/:resourceId/:linkId', ensureAdmin, adminController.removeYoutubeLink);
router.post('/bulk-add-youtube-links/:resourceId', ensureAdmin, validate('bulkAddYoutubeLinksSchema'), adminController.bulkAddYoutubeLinks);

// PYQ Management
router.get('/add-pyq', ensureAdmin, adminController.getAddPyqPage);
router.post('/add-pyq', ensureAdmin, upload.single('pyq'), validate('addPyqSchema'), adminController.postAddPyq);

// Syllabus Management
router.get('/add-syllabus', ensureAdmin, adminController.getAddSyllabusPage);
router.post('/add-syllabus', ensureAdmin, upload.single('pdf'), validate('addSyllabusSchema'), adminController.postAddSyllabus);
router.get('/manage-syllabus', ensureAdmin, adminController.getManageSyllabus);
router.post('/delete-syllabus/:id', ensureAdmin, adminController.deleteSyllabus);

// Notice Management
router.get('/notices', ensureAdmin, require('../controllers/noticeController').getAdminNoticesPage);
router.get('/add-notice', ensureAdmin, require('../controllers/noticeController').getAddNoticePage);
router.post('/add-notice', ensureAdmin, upload.single('noticeImage'), validate('addNoticeSchema'), require('../controllers/noticeController').postAddNotice);
router.post('/delete-notice/:id', ensureAdmin, require('../controllers/noticeController').deleteNotice);
router.post('/toggle-notice/:id', ensureAdmin, require('../controllers/noticeController').toggleNoticeStatus);

// Calendar Management
router.get('/calendar', ensureAdmin, require('../controllers/calendarController').getAdminCalendarPage);
router.get('/calendar/add', ensureAdmin, require('../controllers/calendarController').getAddCalendarEventPage);
router.post('/calendar/add', ensureAdmin, validate('addCalendarEventSchema'), require('../controllers/calendarController').postAddCalendarEvent);
router.get('/calendar/edit/:id', ensureAdmin, require('../controllers/calendarController').getEditCalendarEventPage);
router.post('/calendar/edit/:id', ensureAdmin, validate('editCalendarEventSchema'), require('../controllers/calendarController').postEditCalendarEvent);
router.post('/calendar/delete/:id', ensureAdmin, require('../controllers/calendarController').deleteCalendarEvent);
router.post('/calendar/toggle/:id', ensureAdmin, require('../controllers/calendarController').toggleCalendarEventStatus);

// NEW: Timetable Management
router.get('/timetable', ensureAdmin, require('../controllers/timetableController').getAdminTimetablePage);
router.get('/timetable/add', ensureAdmin, require('../controllers/timetableController').getAddTimetablePage);
router.post('/timetable/add', ensureAdmin, validate('addTimetableSchema'), require('../controllers/timetableController').postAddTimetable);
router.get('/timetable/edit/:id', ensureAdmin, require('../controllers/timetableController').getEditTimetablePage);
router.post('/timetable/edit/:id', ensureAdmin, validate('editTimetableSchema'), require('../controllers/timetableController').postEditTimetable);
router.post('/timetable/delete/:id', ensureAdmin, require('../controllers/timetableController').deleteTimetable);
router.post('/timetable/toggle/:id', ensureAdmin, require('../controllers/timetableController').toggleTimetableStatus);
router.post('/timetable/copy/:id', ensureAdmin, require('../controllers/timetableController').copyTimetable);

module.exports = router;