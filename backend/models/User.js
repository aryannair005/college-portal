const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Existing fields
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    createdAt: { type: Date, default: Date.now },
    
    // New profile fields
    profile: {
        fullName: { type: String, default: '' },
        phone: { type: String, default: '' },
        rollNo: { type: String, default: '' }, // For students
        course: { type: String, default: '' },
        profileImage: { type: String, default: '' }, // Filename for uploaded image
        bio: { type: String, default: '', maxlength: 500 }, // Optional bio field
        dateOfBirth: { type: Date }, // Optional
        address: { type: String, default: '' }, // Optional
        lastProfileUpdate: { type: Date, default: Date.now }
    }
});

// Create a virtual for full profile image path 
userSchema.virtual('profile.profileImagePath').get(function() {
    if (this.profile.profileImage) {
        return `/uploads/profiles/${this.profile.profileImage}`;
    }
    return '/images/default-avatar.png'; // Default avatar
});

// Update lastProfileUpdate when profile is modified
userSchema.pre('save', function(next) {
    if (this.isModified('profile')) {
        this.profile.lastProfileUpdate = new Date();
    }
    next();
});

module.exports = mongoose.model('User', userSchema);