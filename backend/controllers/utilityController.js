const path = require('path');
const fs = require('fs');

// Helper to get base directory
const getBaseDir = () => path.resolve(__dirname, '..'); // Go up one level from controllers

// --- Download Functions ---
exports.downloadResource = (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(getBaseDir(), 'uploads/resources', filename);

    if (fs.existsSync(filepath)) {
        res.download(filepath);
    } else {
        res.status(404).send('File not found');
    }
};

exports.downloadPyq = (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(getBaseDir(), 'uploads/pyqs', filename);

    if (fs.existsSync(filepath)) {
        res.download(filepath);
    } else {
        res.status(404).send('File not found');
    }
};

exports.downloadDoubtImage = (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(getBaseDir(), 'uploads/doubts', filename);

    if (fs.existsSync(filepath)) {
        res.sendFile(filepath);
    } else {
        res.status(404).send('Image not found');
    }
};

exports.downloadSyllabus = (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(getBaseDir(), 'uploads/resources', filename); // Assuming syllabus PDFs are in resources as well

    if (fs.existsSync(filepath)) {
        res.download(filepath);
    } else {
        res.status(404).send('File not found');
    }
};

exports.downloadNoticeImage = (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(getBaseDir(), 'uploads/notices', filename);

    if (fs.existsSync(filepath)) {
        res.sendFile(filepath);
    } else {
        res.status(404).send('Image not found');
    }
};

// NEW: Profile Image Functions
exports.downloadProfileImage = (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(getBaseDir(), 'uploads/profiles', filename);

    if (fs.existsSync(filepath)) {
        res.sendFile(filepath);
    } else {
        res.status(404).send('Image not found');
    }
};

exports.serveProfileImage = (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(getBaseDir(), 'uploads/profiles', filename);

    if (fs.existsSync(filepath)) {
        res.setHeader('Content-Type', 'image/*');
        res.setHeader('Content-Disposition', 'inline');
        res.sendFile(filepath);
    } else {
        res.status(404).send('Image not found');
    }
};

// --- PDF Viewer Functions ---
exports.viewResourcePdf = (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(getBaseDir(), 'uploads/resources', filename);

    if (fs.existsSync(filepath)) {
        res.render('pdf-viewer', {
            title: 'PDF Viewer',
            filename: filename,
            type: 'resource'
        });
    } else {
        req.session.messages = ['PDF file not found'];
        res.redirect('/resources');
    }
};

exports.viewPyqPdf = (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(getBaseDir(), 'uploads/pyqs', filename);

    if (fs.existsSync(filepath)) {
        res.render('pdf-viewer', {
            title: 'PDF Viewer',
            filename: filename,
            type: 'pyq'
        });
    } else {
        req.session.messages = ['PDF file not found'];
        res.redirect('/pyqs');
    }
};

exports.viewSyllabusPdf = (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(getBaseDir(), 'uploads/resources', filename); // Assuming syllabus PDFs are in resources as well

    if (fs.existsSync(filepath)) {
        res.render('pdf-viewer', {
            title: 'Syllabus Viewer',
            filename: filename,
            type: 'syllabus'
        });
    } else {
        req.session.messages = ['Syllabus file not found'];
        res.redirect('/syllabus');
    }
};

// --- Serve PDF for Embedding (inline display) ---
exports.serveResourcePdf = (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(getBaseDir(), 'uploads/resources', filename);

    if (fs.existsSync(filepath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.sendFile(filepath);
    } else {
        res.status(404).send('PDF not found');
    }
};

exports.servePyqPdf = (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(getBaseDir(), 'uploads/pyqs', filename);

    if (fs.existsSync(filepath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.sendFile(filepath);
    } else {
        res.status(404).send('PDF not found');
    }
};

exports.serveSyllabusPdf = (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(getBaseDir(), 'uploads/resources', filename); // Assuming syllabus PDFs are in resources as well

    if (fs.existsSync(filepath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.sendFile(filepath);
    } else {
        res.status(404).send('PDF not found');
    }
};

// Alternative function for serving notice images inline
exports.serveNoticeImage = (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(getBaseDir(), 'uploads/notices', filename);

    if (fs.existsSync(filepath)) {
        res.setHeader('Content-Type', 'image/*');
        res.setHeader('Content-Disposition', 'inline');
        res.sendFile(filepath);
    } else {
        res.status(404).send('Image not found');
    }
};