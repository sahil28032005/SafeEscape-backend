// const { db, collections, fieldValues } = require('../config/firebase-config');

// const userService = {
//     async createUser(userData) {
//         try {
//             const userDoc = await collections.users.add({
//                 ...userData,
//                 createdAt: fieldValues.serverTimestamp(),
//                 updatedAt: fieldValues.serverTimestamp()
//             });
//             return userDoc.id;
//         } catch (error) {
//             console.error('Error creating user:', error);
//             throw error;
//         }
//     },

//     async updateUser(userId, updates) {
//         try {
//             await collections.users.doc(userId).update({
//                 ...updates,
//                 updatedAt: fieldValues.serverTimestamp()
//             });
//             return true;
//         } catch (error) {
//             console.error('Error updating user:', error);
//             throw error;
//         }
//     }
// };

// module.exports = userService; 
const userModel = require('../models/User');

const userService = {
    /**
     * Registers a new user
     * @param {Object} userData - User details
     * @returns {string} userId
     */
    async registerUser(userData) {
        try {
            // Ensure email is unique
            const existingUser = await userModel.getUserByEmail(userData.email);
            if (existingUser) {
                throw new Error('Email already exists');
            }

            // Hash password before saving (Assuming bcrypt is installed)
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            // Create user
            const newUser = {
                ...userData,
                password: hashedPassword,
            };

            const userId = await userModel.createUser(newUser);
            return userId;
        } catch (error) {
            console.error('Error registering user:', error.message);
            throw error;
        }
    },

    /**
     * Updates user profile
     * @param {string} userId
     * @param {Object} updates
     * @returns {boolean} - Success status
     */
    async updateUserProfile(userId, updates) {
        try {
            if (updates.password) {
                const bcrypt = require('bcrypt');
                updates.password = await bcrypt.hash(updates.password, 10);
            }

            return await userModel.updateUser(userId, updates);
        } catch (error) {
            console.error('Error updating profile:', error.message);
            throw error;
        }
    },

    /**
     * Adds an FCM token for push notifications
     * @param {string} userId
     * @param {string} fcmToken
     */
    async addFcmToken(userId, fcmToken) {
        try {
            await userModel.addFcmToken(userId, fcmToken);
        } catch (error) {
            console.error('Error adding FCM token:', error.message);
            throw error;
        }
    },

    /**
     * Removes an FCM token for a user
     * @param {string} userId
     * @param {string} fcmToken
     */
    async removeFcmToken(userId, fcmToken) {
        try {
            await userModel.removeFcmToken(userId, fcmToken);
        } catch (error) {
            console.error('Error removing FCM token:', error.message);
            throw error;
        }
    },

    /**
     * Gets user by ID
     * @param {string} userId
     * @returns {Object} User data
     */
    async getUserById(userId) {
        try {
            return await userModel.getUserById(userId);
        } catch (error) {
            console.error('Error fetching user:', error.message);
            throw error;
        }
    }
};

module.exports = userService;
