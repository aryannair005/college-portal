const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventType: { 
        type: String, 
        enum: ['holiday', 'exam', 'assignment', 'meeting', 'seminar', 'workshop', 'other'], 
        default: 'other' 
    },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdByName: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
calendarSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Calendar', calendarSchema); 