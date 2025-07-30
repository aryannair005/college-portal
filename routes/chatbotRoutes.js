// routes/chatbotRoutes.js
const express = require('express');
const router = express.Router();
const { ensureStudent } = require('../middleware/authMiddleware');
const chatbotController = require('../controllers/chatbotController');
const validate = require('../middleware/validationMiddleware');

// Chatbot page
router.get('/', ensureStudent, chatbotController.getChatPage);

// Send message to chatbot
router.post('/message', ensureStudent, validate('chatMessageSchema'), chatbotController.sendMessage);

// Get conversation history
router.get('/history', ensureStudent, chatbotController.getConversationHistory);

// Clear conversation history
router.delete('/history', ensureStudent, chatbotController.clearConversation);

module.exports = router;