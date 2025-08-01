const express = require('express');
const router = express.Router();
const { ensureStudent } = require('../middleware/authMiddleware');
const utilityController = require('../controllers/utilityController');

// Downloads
router.get('/download/resource/:filename', ensureStudent, utilityController.downloadResource);
router.get('/download/pyq/:filename', ensureStudent, utilityController.downloadPyq);
router.get('/download/doubt/:filename', ensureStudent, utilityController.downloadDoubtImage);
router.get('/download/syllabus/:filename', ensureStudent, utilityController.downloadSyllabus);
router.get('/download/notice/:filename', ensureStudent, utilityController.downloadNoticeImage);
router.get('/download/profile/:filename', ensureStudent, utilityController.downloadProfileImage); // NEW

// PDF Viewers
router.get('/viewer/resource/:filename', ensureStudent, utilityController.viewResourcePdf);
router.get('/viewer/pyq/:filename', ensureStudent, utilityController.viewPyqPdf);
router.get('/viewer/syllabus/:filename', ensureStudent, utilityController.viewSyllabusPdf);

// Serve PDF files directly (for embedding)
router.get('/pdf/resource/:filename', ensureStudent, utilityController.serveResourcePdf);
router.get('/pdf/pyq/:filename', ensureStudent, utilityController.servePyqPdf);
router.get('/pdf/syllabus/:filename', ensureStudent, utilityController.serveSyllabusPdf);

// Image Serving (inline display)
router.get('/serve/notice/:filename', ensureStudent, utilityController.serveNoticeImage);
router.get('/serve/profile/:filename', ensureStudent, utilityController.serveProfileImage); // NEW

module.exports = router;