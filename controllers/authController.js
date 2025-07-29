const User = require('../models/User');
const bcrypt = require('bcryptjs');

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

            const redirectTo = req.session.returnTo || '/dashboard';
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

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};