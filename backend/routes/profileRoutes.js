const express = require('express');
const router = express.Router();
const { ensureStudent } = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');
const upload = require('../config/multerConfig');
const validate = require('../middleware/validationMiddleware');

// Profile routes (accessible to all logged-in users)
router.get('/profile', ensureStudent, profileController.getProfile);
router.get('/profile/edit', ensureStudent, profileController.getEditProfile);
router.post('/profile/update', ensureStudent, upload.single('profileImage'), validate('profileUpdateSchema'), profileController.updateProfile);
router.post('/profile/update-picture', ensureStudent, upload.single('profileImage'), profileController.updateProfilePicture);
router.post('/profile/remove-picture', ensureStudent, profileController.removeProfilePicture);

// Public profile view
router.get('/profile/user/:userId', ensureStudent, profileController.getPublicProfile);

module.exports = router;    