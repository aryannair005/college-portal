// Updated config/multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath;
        if (file.fieldname === 'pyq') {
            uploadPath = 'uploads/pyqs/';
        } else if (file.fieldname === 'pdf') {
            uploadPath = 'uploads/resources/';
        } else if (file.fieldname === 'doubtImage') {
            uploadPath = 'uploads/doubts/';
        } else if (file.fieldname === 'noticeImage') {
            uploadPath = 'uploads/notices/';
        } else if (file.fieldname === 'profileImage') {
            uploadPath = 'uploads/profiles/';
        } else {
            uploadPath = 'uploads/'; // Fallback or handle specific types
        }

        // Ensure the directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for profile images
const profileImageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, JPG, PNG, GIF) are allowed!'));
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function(req, file, cb) {
        if (file.fieldname === 'profileImage') {
            profileImageFilter(req, file, cb);
        } else {
            cb(null, true); // Accept other file types as before
        }
    }
});

module.exports = upload;