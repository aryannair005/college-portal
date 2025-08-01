// migrate-profiles.js
// Run this once to add profile fields to existing users
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function migrateProfiles() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('Connected to MongoDB');
        
        // Find all users without profile field
        const usersWithoutProfile = await User.find({
            $or: [
                { profile: { $exists: false } },
                { profile: null }
            ]
        });
        
        console.log(`Found ${usersWithoutProfile.length} users without profile fields`);
        
        // Update each user
        for (let user of usersWithoutProfile) {
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
            console.log(`Updated profile for user: ${user.username}`);
        }
        
        console.log('Migration completed successfully!');
        
    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the migration
migrateProfiles();