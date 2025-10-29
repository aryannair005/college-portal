const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyDcIECfOxf0jJgLUjV5C3_rTXGRTtesCR4');

// Predefined context about the website
const WEBSITE_CONTEXT = `
You are a helpful assistant for the College Portal website. Here's information about the website:

WEBSITE FEATURES:
- Dashboard: Shows recent doubts and quick access to features
- Resources: Students can browse study materials (PDFs and external links) filtered by course, semester, and subject
- Previous Year Questions (PYQs): Browse and download past exam papers
- Syllabus: Access course syllabi for different subjects
- Doubts & Discussion: Post academic doubts with images, reply to others' doubts
- Notice Board: View important announcements from administrators
- Profile Management: Update personal information, profile pictures, and bio
- Timetable: View class schedules and timings filtered by course, semester, and section
- Academic Calendar: View important academic events, holidays, and exam dates

USER ROLES:
- Students: Can access all features, post doubts, view resources, check timetables and calendar
- Admins: Can add resources, PYQs, syllabus, manage notices, create/manage timetables, and manage calendar events

NAVIGATION:
- Login/Register: Authentication system for students and admins
- Dashboard: Main hub after login
- All main features accessible from navigation bar including Timetable and Calendar

ADMIN FEATURES:
- Add/manage study resources (PDF uploads or external links)
- Add/manage PYQs
- Add/manage syllabus
- Create and manage notices
- Add YouTube links to resources
- Create and manage class timetables for different courses/semesters
- Add and manage academic calendar events

TIMETABLE FEATURES:
- Students can view timetables filtered by course, semester, and section
- Shows daily class schedules with subject, faculty, time slots, and room details
- Displays current active timetables
- Admins can create, edit, copy, and manage multiple timetables
- Timetables include effective dates and academic year information

CALENDAR FEATURES:
- View academic events in calendar format
- Shows important dates like exams, holidays, and academic deadlines
- Admins can add events with titles, descriptions, dates, and categories
- Students can view all upcoming events and important dates

KEY RULES:
1. Only answer questions about website features, navigation, and functionality
2. Do NOT provide academic help, solve doubts, or answer subject-related questions
3. Direct users to the "Doubts & Discussion" section for academic help
4. Be helpful and concise
5. If asked about something not related to the website, politely redirect

COMMON TOPICS YOU CAN HELP WITH:
- How to navigate the website
- How to upload/download resources
- How to post doubts
- How to update profile
- Admin functionalities
- Website features explanation
- Login/registration issues
- File upload procedures
- How to view timetables
- How to check calendar events
- Timetable and calendar management (for admins)
`;

const PREDEFINED_RESPONSES = {
    'how to login': 'To login, click the "Login" button in the navigation bar, enter your username and password. Students can register for new accounts, while admins need a special creation page.',
    'how to register': 'Click "Register" in the navigation bar to create a new student account. You\'ll need to provide a username, email, and password.',
    'how to upload resources': 'Only administrators can upload resources. Go to Admin Dashboard → Add Resource, fill in the details, and upload a PDF or provide an external link.',
    'how to post doubt': 'Go to "Doubts & Discussion" from the navigation menu, click "Post Your Doubt", fill in the title, description, course details, and optionally attach an image.',
    'how to update profile': 'Click on your username in the top-right corner → "My Profile" → "Edit Profile" to update your personal information and profile picture.',
    'admin access': 'To create an admin account, go to /create-admin and use the secret code. Contact the system administrator for the secret code.',
    'download files': 'You can download resources and PYQs by clicking the download button on the respective cards. PDFs can also be viewed inline.',
    'notice board': 'Check the "Notices" section in the navigation menu to view important announcements from administrators.',
    'view timetable': 'Click "Timetable" in the navigation menu to view class schedules. You can filter by course, semester, and section to find your specific timetable.',
    'check timetable': 'Go to the "Timetable" section from the navigation bar. Use the filters to select your course, semester, and section to view your class schedule with timings, subjects, and faculty details.',
    'timetable': 'The Timetable section shows your class schedules with daily timings, subjects, faculty names, and room details. Filter by course, semester, and section to find your specific schedule.',
    'class schedule': 'Your class schedule is available in the "Timetable" section. Filter by your course, semester, and section to see daily class timings, subjects, and faculty information.',
    'calendar': 'Click "Calendar" in the navigation menu to view academic events, important dates, holidays, and exam schedules in a calendar format.',
    'academic calendar': 'The Academic Calendar shows important dates like exams, holidays, and academic deadlines. Access it through the "Calendar" link in the navigation menu.',
    'events': 'Check the "Calendar" section to view all academic events, including exam dates, holidays, and important academic deadlines.',
    'manage timetable': 'Admins can manage timetables by going to Admin Dashboard → Manage Timetables. You can create, edit, copy, activate/deactivate, and delete timetables for different courses.',
    'add timetable': 'Admins can add new timetables by going to Admin Dashboard → Add Timetable. Fill in course details, semester, section, academic year, and create the weekly schedule.',
    'manage calendar': 'Admins can manage calendar events by going to Admin Dashboard → Manage Calendar. You can add, edit, and delete academic events and important dates.',
    'add event': 'Admins can add calendar events by going to Admin Dashboard → Add Event. Include event title, description, date, and category information.'
};

exports.getChatbotPage = (req, res) => {
    res.render('chatbot', { 
        title: 'Website Assistant',
        initialMessage: 'Hi! I\'m here to help you navigate the College Portal. Ask me about website features, how to use different sections, view timetables, check calendar events, or any navigation questions!'
    });
};

exports.postChatMessage = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || message.trim().length === 0) {
            return res.json({
                success: false,
                error: 'Please enter a message'
            });
        }

        const userMessage = message.trim().toLowerCase();
        
        // Check for predefined responses first
        const predefinedResponse = checkPredefinedResponses(userMessage);
        if (predefinedResponse) {
            return res.json({
                success: true,
                response: predefinedResponse
            });
        }

        // Check if the question is academic/doubt-related
        if (isAcademicQuestion(userMessage)) {
            return res.json({
                success: true,
                response: 'I can only help with website-related questions. For academic doubts and subject help, please use the "Doubts & Discussion" section where you can post your questions and get help from other students and teachers.'
            });
        }

        // Use Gemini AI for other website-related questions
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const prompt = `${WEBSITE_CONTEXT}

User Question: ${message}

Please provide a helpful response about the College Portal website. Remember to:
1. Only answer questions about website functionality
2. Redirect academic questions to the Doubts section
3. Be concise and helpful
4. If the question is not about the website, politely say you can only help with website-related questions`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const botResponse = response.text();

        res.json({
            success: true,
            response: botResponse
        });

    } catch (error) {
        console.error('Chatbot error:', error);
        res.json({
            success: false,
            error: 'Sorry, I\'m having trouble right now. Please try again later or contact support.'
        });
    }
};

// Helper function to check predefined responses
function checkPredefinedResponses(message) {
    for (const [key, response] of Object.entries(PREDEFINED_RESPONSES)) {
        if (message.includes(key)) {
            return response;
        }
    }
    return null;
}

// Helper function to detect academic questions
function isAcademicQuestion(message) {
    const academicKeywords = [
        'solve', 'solution', 'answer', 'homework', 'assignment', 'math', 'physics', 
        'chemistry', 'biology', 'computer science', 'programming', 'algorithm',
        'equation', 'formula', 'theorem', 'proof', 'calculate', 'find the value',
        'what is the result', 'how to solve', 'explain the concept', 'definition of',
        'java', 'python', 'c++', 'database', 'sql', 'html', 'css', 'javascript'
    ];
    
    return academicKeywords.some(keyword => message.includes(keyword));
}

// Get chat history (if you want to implement persistence later)
exports.getChatHistory = async (req, res) => {
    // For now, return empty array
    // Later you can implement database storage for chat history
    res.json({
        success: true,
        history: []
    });
};