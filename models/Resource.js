const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    course: { type: String, required: true },
    semester: { type: String, required: true },
    subject: { type: String, required: true },
    type: { type: String, enum: ['pdf', 'link'], required: true },
    url: String, // for link
    filename: String, // for pdf
    youtubeLinks: [{
        topicName: { type: String, required: true },
        url: { type: String, required: true },
        addedAt: { type: Date, default: Date.now }
    }],
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', resourceSchema);