const express = require('express');
const router = express.Router();
const { ensureStudent, ensureAdmin } = require('../middleware/authMiddleware');
const feedbackController = require('../controllers/feedbackController');
const upload = require('../config/multerConfig');
const validate = require('../middleware/validationMiddleware');

// Student Routes
router.get('/add', ensureStudent, feedbackController.getAddFeedbackPage);
router.post('/add', ensureStudent, upload.single('feedbackImage'), validate('addFeedbackSchema'), feedbackController.postAddFeedback);
router.get('/my-feedback', ensureStudent, feedbackController.getMyFeedback);
router.get('/:id', ensureStudent, feedbackController.getFeedbackDetail);

// Admin Routes - Note: These will be accessed as /feedback/admin/manage, etc.
router.get('/admin/manage', ensureAdmin, feedbackController.getAdminFeedbackPage);
router.post('/admin/update-status/:id', ensureAdmin, validate('updateFeedbackStatusSchema'), feedbackController.updateFeedbackStatus);
router.post('/admin/delete/:id', ensureAdmin, feedbackController.deleteFeedback);
router.get('/admin/export', ensureAdmin, feedbackController.exportFeedback);

// Utility Routes
router.get('/download/:filename', ensureStudent, feedbackController.downloadFeedbackAttachment);

module.exports = router;