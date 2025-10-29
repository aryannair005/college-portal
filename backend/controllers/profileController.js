const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Get Profile Page
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            req.session.messages = ['User not found'];
            return res.redirect('/');
        }

        // Ensure profile object exists with default values
        if (!user.profile) {
            user.profile = {
                fullName: '',
                phone: '',
                rollNo: '',
                course: '',
                profileImage: '',
                bio: '',
                dateOfBirth: null,
                address: '',
                lastProfileUpdate: new Date()
            };
            await user.save();
        }

        // Choose the appropriate template based on user role
        const templatePath = user.role === 'admin' ? 'admin/profile' : 'profile/view-profile';
        
        res.render(templatePath, {
            title: 'My Profile',
            user: user
        });
    } catch (error) {
        console.error('Error loading profile:', error);
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
        req.session.messages = ['Error loading profile: ' + error.message];
        res.redirect('/dashboard');
    }
};

// Get Edit Profile Page
exports.getEditProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            req.session.messages = ['User not found'];
            return res.redirect('/');
        }

        // Ensure profile object exists with default values
        if (!user.profile) {
            user.profile = {
                fullName: '',
                phone: '',
                rollNo: '',
                course: '',
                profileImage: '',
                bio: '',
                dateOfBirth: null,
                address: '',
                lastProfileUpdate: new Date()
            };
            await user.save();
        }

        res.render('profile/edit-profile', {
            title: 'Edit Profile',
            user: user
        });
    } catch (error) {
        console.error('Error loading edit profile page:', error);
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
        req.session.messages = ['Error loading profile page: ' + error.message];
        res.redirect('/profile');
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const { fullName, phone, rollNo, course, bio, dateOfBirth, address } = req.body;
        // Note: We explicitly don't extract email from req.body since it's read-only
        
        const user = await User.findById(req.session.userId);
        if (!user) {
            req.session.messages = ['User not found'];
            return res.redirect('/');
        }

        // Ensure profile object exists
        if (!user.profile) {
            user.profile = {};
        }

        // Update profile fields (email is not updated from form)
        user.profile.fullName = fullName || '';
        user.profile.phone = phone || '';
        user.profile.rollNo = rollNo || '';
        user.profile.course = course || '';
        user.profile.bio = bio || '';
        user.profile.address = address || '';
        
        if (dateOfBirth && dateOfBirth.trim() !== '') {
            user.profile.dateOfBirth = new Date(dateOfBirth);
        }

        // Handle profile image upload
        if (req.file) {
            // Delete old profile image if it exists
            if (user.profile.profileImage) {
                const oldImagePath = path.join(__dirname, '../uploads/profiles', user.profile.profileImage);
                if (fs.existsSync(oldImagePath)) {
                    try {
                        fs.unlinkSync(oldImagePath);
                    } catch (err) {
                        console.error('Error deleting old profile image:', err);
                    }
                }
            }
            user.profile.profileImage = req.file.filename;
        }

        user.profile.lastProfileUpdate = new Date();
        await user.save();
        
        req.session.messages = ['Profile updated successfully!'];
        res.redirect('/profile');
    } catch (error) {
        console.error('Error updating profile:', error);
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
        req.session.messages = ['Error updating profile: ' + error.message];
        res.redirect('/profile/edit');
    }
};

// Update Profile Picture Only
exports.updateProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            req.session.messages = ['Please select an image file'];
            return res.redirect('/profile/edit');
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            req.session.messages = ['User not found'];
            return res.redirect('/');
        }

        // Delete old profile image if it exists
        if (user.profile.profileImage) {
            const oldImagePath = path.join(__dirname, '../uploads/profiles', user.profile.profileImage);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        user.profile.profileImage = req.file.filename;
        await user.save();

        req.session.messages = ['Profile picture updated successfully!'];
        res.redirect('/profile');
    } catch (error) {
        console.error('Error updating profile picture:', error);
        req.session.messages = ['Error updating profile picture'];
        res.redirect('/profile/edit');
    }
};

// Remove Profile Picture
exports.removeProfilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            req.session.messages = ['User not found'];
            return res.redirect('/');
        }

        // Delete profile image file if it exists
        if (user.profile.profileImage) {
            const imagePath = path.join(__dirname, '../uploads/profiles', user.profile.profileImage);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
            user.profile.profileImage = '';
            await user.save();
        }

        req.session.messages = ['Profile picture removed successfully!'];
        res.redirect('/profile');
    } catch (error) {
        console.error('Error removing profile picture:', error);
        req.session.messages = ['Error removing profile picture'];
        res.redirect('/profile');
    }
};

// Get Public Profile (for viewing other users)
exports.getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            req.session.messages = ['User not found'];
            return res.redirect('/dashboard');
        }

        res.render('profile/public-profile', {
            title: `${user.profile.fullName || user.username}'s Profile`,
            profileUser: user,
            isOwnProfile: req.session.userId === user._id.toString()
        });
    } catch (error) {
        console.error('Error loading public profile:', error);
        req.session.messages = ['Error loading profile'];
        res.redirect('/dashboard');
    }
};