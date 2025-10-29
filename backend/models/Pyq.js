const mongoose = require('mongoose');

const pyqSchema = new mongoose.Schema({
    course: { type: String, required: true },
    semester: { type: String, required: true },
    subject: { type: String, required: true },
    filename: { type: String, required: true },
    originalName: String,
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pyq', pyqSchema);