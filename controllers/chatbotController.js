// controllers/chatbotController.js
const axios = require('axios');

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAMZWSjVWUErk5DYsE-PsjSv5siY1Fys-Q';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// System prompt to make the chatbot educational and helpful for college students
const SYSTEM_PROMPT = `You are StudyBot, an AI assistant designed to help college students with their studies. You specialize in:

1. Explaining complex academic concepts in simple terms
2. Helping with homework and assignments (providing guidance, not direct answers)
3. Study techniques and tips
4. Time management for students
5. Academic subjects like Mathematics, Science, Computer Science, Engineering, Arts, etc.
6. Exam preparation strategies
7. Research assistance and methodology

Guidelines:
- Always be encouraging and supportive
- Provide educational explanations rather than direct answers to homework
- Suggest additional resources when appropriate
- Keep responses concise but comprehensive
- Use examples to clarify concepts
- Encourage critical thinking
- If asked about non-academic topics, politely redirect to educational content

Remember: You're here to guide students in their learning journey, not to do their work for them.`;

exports.getChatPage = (req, res) => {
    res.render('chatbot', { 
        title: 'StudyBot - AI Study Assistant',
        messages: []
    });
};

exports.sendMessage = async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Message cannot be empty' 
            });
        }

        // Check if API key is configured
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-actual-gemini-api-key-here') {
            console.error('Gemini API key not configured');
            return res.status(500).json({
                success: false,
                error: 'Chatbot service is not configured. Please contact support.'
            });
        }

        // Prepare conversation context
        let conversationContext = SYSTEM_PROMPT + '\n\n';
        
        // Add conversation history (last 10 messages for context)
        const recentHistory = conversationHistory.slice(-10);
        recentHistory.forEach(msg => {
            conversationContext += `${msg.role === 'user' ? 'Student' : 'StudyBot'}: ${msg.content}\n`;
        });
        
        conversationContext += `Student: ${message}\nStudyBot:`;

        // Prepare the request payload for Gemini API
        const requestData = {
            contents: [{
                parts: [{
                    text: conversationContext
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        console.log('Making request to Gemini API...');

        // Make API call to Gemini
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 30000 // 30 second timeout
            }
        );

        console.log('Gemini API Response Status:', response.status);

        if (response.data && response.data.candidates && response.data.candidates[0]) {
            const botResponse = response.data.candidates[0].content.parts[0].text;
            
            res.json({
                success: true,
                response: botResponse.trim(),
                timestamp: new Date().toISOString()
            });
        } else {
            console.error('Invalid response structure from Gemini API:', response.data);
            throw new Error('Invalid response from Gemini API');
        }

    } catch (error) {
        console.error('Chatbot API Error:', error.response?.data || error.message);
        
        let errorMessage = 'Sorry, I encountered an error. Please try again.';
        
        if (error.code === 'ECONNABORTED') {
            errorMessage = 'Request timeout. Please try again with a shorter message.';
        } else if (error.response?.status === 429) {
            errorMessage = 'Too many requests. Please wait a moment before trying again.';
        } else if (error.response?.status === 401 || error.response?.status === 403) {
            errorMessage = 'API authentication error. Please contact support.';
            console.error('API Key Error - Check if your Gemini API key is valid');
        } else if (error.response?.status === 400) {
            errorMessage = 'Invalid request. Please try rephrasing your message.';
            console.error('Bad Request Error:', error.response?.data);
        }

        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
};

// Get conversation history for a user (you can extend this to save to database)
exports.getConversationHistory = async (req, res) => {
    try {
        // For now, return empty array. You can implement database storage later
        res.json({
            success: true,
            history: []
        });
    } catch (error) {
        console.error('Error fetching conversation history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch conversation history'
        });
    }
};

// Clear conversation history
exports.clearConversation = async (req, res) => {
    try {
        // For now, just return success. You can implement database clearing later
        res.json({
            success: true,
            message: 'Conversation history cleared'
        });
    } catch (error) {
        console.error('Error clearing conversation history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to clear conversation history'
        });
    }
};