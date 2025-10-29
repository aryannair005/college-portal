const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 200
    },
    message: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 2000
    },
    category: {
        type: String,
        required: true,
        enum: ['general', 'technical', 'suggestion', 'complaint', 'feature-request', 'other'],
        default: 'general'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved', 'closed'],
        default: 'pending'
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    submittedByName: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedByName: {
        type: String
    },
    reviewedAt: {
        type: Date
    },
    adminResponse: {
        message: {
            type: String,
            trim: true
        },
        respondedAt: {
            type: Date
        }
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    attachments: [{
        filename: String,
        originalName: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }]
});

// Index for better query performance
feedbackSchema.index({ status: 1, submittedAt: -1 });
feedbackSchema.index({ submittedBy: 1, submittedAt: -1 });
feedbackSchema.index({ category: 1, submittedAt: -1 });

// Virtual for formatted date
feedbackSchema.virtual('formattedDate').get(function() {
    return this.submittedAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
});

// Virtual for time ago
feedbackSchema.virtual('timeAgo').get(function() {
    const now = new Date();
    const diff = now - this.submittedAt;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
});

// Method to update status
feedbackSchema.methods.updateStatus = function(status, adminId, adminName) {
    this.status = status;
    if (adminId) {
        this.reviewedBy = adminId;
        this.reviewedByName = adminName;
        this.reviewedAt = new Date();
    }
    return this.save();
};

// Static method to get feedback statistics
feedbackSchema.statics.getStats = function() {
    return this.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$count' },
                stats: {
                    $push: {
                        status: '$_id',
                        count: '$count'
                    }
                }
            }
        }
    ]);
};

module.exports = mongoose.model('Feedback', feedbackSchema);