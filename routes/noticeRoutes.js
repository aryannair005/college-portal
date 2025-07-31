const express = require('express');
const router = express.Router();
const { ensureStudent, ensureAdmin } = require('../middleware/authMiddleware');
const noticeController = require('../controllers/noticeController');
const upload = require('../config/multerConfig');
const validate = require('../middleware/validationMiddleware');

// === STUDENT ROUTES ===
router.get('/', ensureStudent, noticeController.getNoticesPage);
router.get('/:id', ensureStudent, noticeController.getSingleNotice);

// === ADMIN ROUTES ===
router.get('/admin/manage', ensureAdmin, noticeController.getAdminNoticesPage);
router.get('/admin/add', ensureAdmin, (req, res) => {
    res.render('admin/add-notice', { title: 'Add Notice' });
});
router.post('/admin/add', ensureAdmin, upload.single('noticeImage'), validate('addNoticeSchema'), noticeController.postAddNotice);
router.post('/admin/delete/:id', ensureAdmin, noticeController.deleteNotice);
router.post('/admin/toggle/:id', ensureAdmin, noticeController.toggleNoticeStatus);

module.exports = router;