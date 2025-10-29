// routes/doubtRoutes.js
const express = require('express');
const router = express.Router();
const { ensureStudent } = require('../middleware/authMiddleware');
const doubtController = require('../controllers/doubtController');
const upload = require('../config/multerConfig');
const validate = require('../middleware/validationMiddleware'); // Import validation middleware

router.get('/', ensureStudent, doubtController.getDoubts);
router.get('/add', ensureStudent, doubtController.getAddDoubtPage);
router.post('/add', ensureStudent, upload.single('doubtImage'), validate('addDoubtSchema'), doubtController.postAddDoubt); // Add validation
router.get('/:id', ensureStudent, doubtController.getSingleDoubt);
router.post('/:id/reply', ensureStudent, validate('replyToDoubtSchema'), doubtController.postReplyToDoubt); // Add validation
router.post('/:id/solved', ensureStudent, doubtController.postMarkDoubtAsSolved);

module.exports = router;