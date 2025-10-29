const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Secret code for admin creation (you can change this or move to environment variables)
const ADMIN_SECRET_CODE = 'COLLEGE_ADMIN_2025';

exports.getLoginPage = (req, res) => {
    res.render('auth/login', { title: 'Login' });
};

exports.postLogin = async (req, res) => {
    // Joi validation handled by middleware
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id;
            req.session.username = user.username;
            req.session.userRole = user.role;

            // Redirect based on role
            let redirectTo;
            if (user.role === 'admin') {
                redirectTo = req.session.returnTo || '/admin';
            } else {
                redirectTo = req.session.returnTo || '/dashboard';
            }
            
            delete req.session.returnTo;
            res.redirect(redirectTo);
        } else {
            req.session.messages = ['Invalid credentials'];
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Login error:', error);
        req.session.messages = ['Login error occurred'];
        res.redirect('/login');
    }
};

exports.getRegisterPage = (req, res) => {
    res.render('auth/register', { title: 'Register' });
};

exports.postRegister = async (req, res) => {
    // Joi validation handled by middleware
    try {
        const { username, email, password } = req.body; // confirmPassword is validated by Joi, no need to deconstruct here

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            req.session.messages = ['Username or email already exists'];
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();
        req.session.messages = ['Registration successful! Please login.'];
        res.redirect('/login');
    } catch (error) {
        console.error('Registration error:', error);
        req.session.messages = ['Registration error occurred'];
        res.redirect('/register');
    }
};

// New Admin Creation Routes
exports.getCreateAdminPage = (req, res) => {
    res.render('auth/create-admin', { title: 'Create Admin Account' });
};

exports.postCreateAdmin = async (req, res) => {
    // Joi validation handled by middleware
    try {
        const { secretCode, username, email, password } = req.body;

        // Check secret code
        if (secretCode !== ADMIN_SECRET_CODE) {
            req.session.messages = ['Invalid secret code. Access denied.'];
            return res.redirect('/create-admin');
        }

        // Server-side password validation with detailed feedback
        const passwordErrors = [];
        if (password.length < 8) {
            passwordErrors.push('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            passwordErrors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            passwordErrors.push('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            passwordErrors.push('Password must contain at least one number');
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            passwordErrors.push('Password must contain at least one special character');
        }

        if (passwordErrors.length > 0) {
            req.session.messages = passwordErrors;
            return res.redirect('/create-admin');
        }

        // Check if admin already exists with this username or email
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            req.session.messages = ['Username or email already exists'];
            return res.redirect('/create-admin');
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new User({
            username,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();
        req.session.messages = ['Admin account created successfully! You can now login.'];
        res.redirect('/login');
    } catch (error) {
        console.error('Admin creation error:', error);
        req.session.messages = ['Error creating admin account'];
        res.redirect('/create-admin');
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};