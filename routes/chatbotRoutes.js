const express = require('express');
const router = express.Router();
const { ensureStudent } = require('../middleware/authMiddleware');
const chatbotController = require('../controllers/chatbotController');
const Joi = require('joi');

// Validation schema for chat messages
const chatMessageSchema = Joi.object({
    message: Joi.string().trim().min(1).max(500).required().messages({
        'string.empty': 'Message cannot be empty',
        'string.min': 'Message must be at least 1 character',
        'string.max': 'Message cannot exceed 500 characters',
        'any.required': 'Message is required'
    })
});

// Validation middleware for chat
const validateChatMessage = (req, res, next) => {
    const { error } = chatMessageSchema.validate(req.body);
    if (error) {
        return res.json({
            success: false,
            error: error.details[0].message
        });
    }
    next();
};

// Chat routes
router.get('/assistant', ensureStudent, chatbotController.getChatbotPage);
router.post('/assistant/message', ensureStudent, validateChatMessage, chatbotController.postChatMessage);
router.get('/assistant/history', ensureStudent, chatbotController.getChatHistory);

module.exports = router;