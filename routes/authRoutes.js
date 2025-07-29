const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validationMiddleware'); // Import validation middleware

router.get('/login', authController.getLoginPage);
router.post('/login', validate('loginSchema'), authController.postLogin); // Add validation
router.get('/register', authController.getRegisterPage);
router.post('/register', validate('registerSchema'), authController.postRegister); // Add validation
router.get('/logout', authController.logout);

module.exports = router;