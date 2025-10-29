const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    course: { type: String, required: true },
    semester: { type: String, required: true },
    subject: { type: String, required: true },
    image: String, // optional image filename
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postedByName: String,
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    replies: [{
        message: String,
        repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        repliedByName: String,
        repliedAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Doubt', doubtSchema);