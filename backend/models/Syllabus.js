const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
    title: { type: String, required: true },
    course: { type: String, required: true },
    semester: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['pdf', 'link'], required: true },
    url: String, // for link
    filename: String, // for pdf
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Syllabus', syllabusSchema);