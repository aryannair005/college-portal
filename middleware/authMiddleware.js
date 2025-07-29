const ensureStudent = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect('/login');
    }
};

const ensureAdmin = (req, res, next) => {
    if (req.session.userId && req.session.userRole === 'admin') {
        next();
    } else {
        req.session.messages = ['Unauthorized access. Please login as admin.'];
        res.redirect('/login');
    }
};

module.exports = {
    ensureStudent,
    ensureAdmin
};