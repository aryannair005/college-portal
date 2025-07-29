// ==================== APP.JS (formerly server.js) ====================
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs'); // Still needed for initial admin creation
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const fs = require('fs'); // Still needed for initial directory checks, if any

// Import Models (optional: if you need to access them directly in app.js, e.g., for admin creation)
const User = require('./models/User'); // Required for createAdminUser

// Import Middleware
const { ensureStudent, ensureAdmin } = require('./middleware/authMiddleware'); // For global use if needed, but primarily in routes

// Import Routers
const indexRouter = require('./routes/index');
const authRouter = require('./routes/authRoutes');
const studentRouter = require('./routes/studentRoutes');
const doubtRouter = require('./routes/doubtRoutes');
const adminRouter = require('./routes/adminRoutes');
const utilityRouter = require('./routes/utilityRoutes'); // For downloads/viewers

const app = express();

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/college_portal', {
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

// Ensure upload directories exist on startup
const uploadBaseDir = path.join(__dirname, 'uploads');
const uploadDirs = [
    path.join(uploadBaseDir, 'pyqs'),
    path.join(uploadBaseDir, 'resources'),
    path.join(uploadBaseDir, 'doubts')
];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});


// Session configuration
app.use(session({
    secret: 'college-portal-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// EJS and Layouts
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('views', path.join(__dirname, 'views')); // Explicitly set views directory

// Global variables for templates
app.use((req, res, next) => {
    res.locals.user = req.session.userId ? {
        id: req.session.userId,
        username: req.session.username,
        role: req.session.userRole
    } : null;
    res.locals.messages = req.session.messages || [];
    req.session.messages = [];
    next();
});

// ==================== Mount Routers ====================
app.use('/', indexRouter); // Home route
app.use('/', authRouter); // Login, Register, Logout
app.use('/', studentRouter); // Dashboard, Resources, PYQs, Syllabus (student view)
app.use('/doubts', doubtRouter); // All doubt related routes
app.use('/admin', adminRouter); // Admin routes
app.use('/', utilityRouter); // Download and Viewer routes

// Handle 404 (Not Found)
app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

// Basic Error Handler (Add more robust error handling in production)
app.use((err, req, res, next) => {
    console.error(err.stack);
    req.session.messages = ['An unexpected error occurred. Please try again.'];
    res.status(500).redirect('/'); // Redirect to home or a dedicated error page
});

// ==================== SERVER START ====================
const PORT = process.env.PORT || 3000;

// Create admin user on first run (moved here as it uses User model and bcrypt)
const createAdminUser = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = new User({
                username: 'admin',
                email: 'admin@college.edu',
                password: hashedPassword,
                role: 'admin'
            });
            await admin.save();
            console.log('Admin user created: username=admin, password=admin123');
        }
    } catch (error) {
        console.log('Error creating admin user:', error);
    }
};

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    createAdminUser(); // Call this on server start
    // migrateResources(); // Uncomment this line and run once to update old resources, then comment it back.
});

// Original migration function (can be placed here or run as a separate script)
async function migrateResources() {
    try {
        const resources = await Resource.find({ youtubeLinks: { $exists: false } }); // Assuming Resource model is imported
        for (let resource of resources) {
            resource.youtubeLinks = [];
            await resource.save();
        }
        console.log(`Migrated ${resources.length} resources to include youtubeLinks field`);
    } catch (error) {
        console.error('Migration error:', error);
    }
}