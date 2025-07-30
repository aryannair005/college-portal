const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validationMiddleware');

// Regular authentication routes
router.get('/login', authController.getLoginPage);
router.post('/login', validate('loginSchema'), authController.postLogin);
router.get('/register', authController.getRegisterPage);
router.post('/register', validate('registerSchema'), authController.postRegister);

// Admin creation routes - Make sure these exist
router.get('/create-admin', authController.getCreateAdminPage);
router.post('/create-admin', validate('createAdminSchema'), authController.postCreateAdmin);

// Logout route
router.get('/logout', authController.logout);

// Debug: Add this temporarily to test
router.get('/test-create-admin', (req, res) => {
    res.send('Create admin route is working!');
});

module.exports = router;