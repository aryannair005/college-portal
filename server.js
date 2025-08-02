require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const fs = require('fs');

const User = require('./models/User');

// Middleware
const { ensureStudent, ensureAdmin } = require('./middleware/authMiddleware');

//Routers
const indexRouter = require('./routes/index');
const authRouter = require('./routes/authRoutes');
const studentRouter = require('./routes/studentRoutes');
const doubtRouter = require('./routes/doubtRoutes');
const adminRouter = require('./routes/adminRoutes');
const utilityRouter = require('./routes/utilityRoutes');
const noticeRouter = require('./routes/noticeRoutes');
const profileRouter = require('./routes/profileRoutes');
const chatbotRouter = require('./routes/chatbotRoutes');
const calendarRouter = require('./routes/calendarRoutes');

const app = express();

// MongoDB Connection 
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));


const uploadBaseDir = path.join(__dirname, 'uploads');
const uploadDirs = [
    path.join(uploadBaseDir, 'pyqs'),
    path.join(uploadBaseDir, 'resources'),
    path.join(uploadBaseDir, 'doubts'),
    path.join(uploadBaseDir, 'notices'),
    path.join(uploadBaseDir, 'profiles')
];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Session configuration
const SESSION_SECRET = process.env.SESSION_SECRET || 'college-portal-secret-key';
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// EJS and Layouts
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('views', path.join(__dirname, 'views'));

// Global variables for templates
app.use(async (req, res, next) => {
    if (req.session.userId) {
        try {
            const userWithProfile = await User.findById(req.session.userId);
            res.locals.user = {
                id: req.session.userId,
                username: req.session.username,
                role: req.session.userRole,
                profile: userWithProfile ? userWithProfile.profile : {}
            };
        } catch (error) {
            console.error('Error fetching user profile for navbar:', error);
            res.locals.user = {
                id: req.session.userId,
                username: req.session.username,
                role: req.session.userRole,
                profile: {}
            };
        }
    } else {
        res.locals.user = null;
    }
    
    res.locals.messages = req.session.messages || [];
    req.session.messages = [];
    next();
});

//Routers 
app.use('/', indexRouter); // Home route
app.use('/', authRouter); // Login, Register, Logout, Create Admin
app.use('/', studentRouter); // Dashboard, Resources, PYQs, Syllabus (student view)
app.use('/doubts', doubtRouter); // All doubt related routes
app.use('/admin', adminRouter); // Admin routes
app.use('/', utilityRouter); // Download and Viewer routes
app.use('/notices', noticeRouter); // Notice routes
app.use('/', profileRouter); // Profile routes
app.use('/', chatbotRouter); // NEW: Chatbot routes
app.use('/calendar', calendarRouter); // Calendar routes

// 404 (Not Found)
app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

//Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    req.session.messages = ['An unexpected error occurred. Please try again.'];
    res.status(500).redirect('/');
});

//SERVER START
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('2. Use secret code: COLLEGE_ADMIN_2025');
});