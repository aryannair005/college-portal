const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: String, // optional image filename
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high', 'urgent'], 
        default: 'medium' 
    },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdByName: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: { 
        type: Date, 
        default: function() {
            // Automatically set expiration to 2 weeks from creation
            return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
        },
        index: { expireAfterSeconds: 0 } // MongoDB TTL index for automatic deletion
    }
});

module.exports = mongoose.model('Notice', noticeSchema);