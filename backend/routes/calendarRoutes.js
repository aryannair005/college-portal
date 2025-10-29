const express = require('express');
const router = express.Router();
const { ensureStudent, ensureAdmin } = require('../middleware/authMiddleware');
const calendarController = require('../controllers/calendarController');
const validate = require('../middleware/validationMiddleware');

// === STUDENT ROUTES ===
router.get('/', ensureStudent, calendarController.getCalendarPage);
router.get('/events/:year/:month', ensureStudent, calendarController.getCalendarEvents);

// === ADMIN ROUTES ===
router.get('/admin/manage', ensureAdmin, calendarController.getAdminCalendarPage);
router.get('/admin/add', ensureAdmin, calendarController.getAddCalendarEventPage);
router.post('/admin/add', ensureAdmin, validate('addCalendarEventSchema'), calendarController.postAddCalendarEvent);
router.get('/admin/edit/:id', ensureAdmin, calendarController.getEditCalendarEventPage);
router.post('/admin/edit/:id', ensureAdmin, validate('editCalendarEventSchema'), calendarController.postEditCalendarEvent);
router.post('/admin/delete/:id', ensureAdmin, calendarController.deleteCalendarEvent);
router.post('/admin/toggle/:id', ensureAdmin, calendarController.toggleCalendarEventStatus);

module.exports = router; 