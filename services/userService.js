const userModel = require('../models/User');
const { fieldValues } = require('../config/firebase-config');

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

            // Hash password before saving
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            // Set default emergency contacts if not provided
            const defaultEmergencyContacts = [
                { name: 'Police', phone: '112', relationship: 'Emergency', priority: 1 },
                { name: 'Fire Brigade', phone: '101', relationship: 'Emergency', priority: 2 },
                { name: 'Ambulance', phone: '108', relationship: 'Emergency', priority: 3 },
            ];

            const newUser = {
                ...userData,
                password: hashedPassword,
                emergencyContacts: userData.emergencyContacts || defaultEmergencyContacts,
            };

            // Create user in Firestore
            const userId = await userModel.createUser(newUser);
            return userId;
        } catch (error) {
            console.error('❌ Error registering user:', error.message);
            throw new Error(`Failed to register user: ${error.message}`);
        }
    },

    /**
     * Updates user profile (including emergency contacts)
     * @param {string} userId - Firestore Document ID
     * @param {Object} updates - Fields to update
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
            console.error('❌ Error updating user profile:', error.message);
            throw new Error(`Failed to update profile: ${error.message}`);
        }
    },

    /**
     * Adds an FCM token for push notifications
     * @param {string} userId - Firestore Document ID
     * @param {string} fcmToken - FCM token to add
     */
    async addFcmToken(userId, fcmToken) {
        try {
            await userModel.addFcmToken(userId, fcmToken);
        } catch (error) {
            console.error('❌ Error adding FCM token:', error.message);
            throw new Error(`Failed to add FCM token: ${error.message}`);
        }
    },

    /**
     * Removes an FCM token for push notifications
     * @param {string} userId - Firestore Document ID
     * @param {string} fcmToken - FCM token to remove
     */
    async removeFcmToken(userId, fcmToken) {
        try {
            await userModel.removeFcmToken(userId, fcmToken);
        } catch (error) {
            console.error('❌ Error removing FCM token:', error.message);
            throw new Error(`Failed to remove FCM token: ${error.message}`);
        }
    },

    /**
     * Gets user by ID (including embedded emergency contacts)
     * @param {string} userId - Firestore Document ID
     * @returns {Object|null} User data
     */
    async getUserById(userId) {
        try {
            return await userModel.getUserById(userId);
        } catch (error) {
            console.error('❌ Error fetching user:', error.message);
            throw new Error(`Failed to fetch user: ${error.message}`);
        }
    },

    /**
     * Add an emergency contact to a user
     * @param {string} userId - Firestore Document ID
     * @param {Object} contact - Emergency contact to add
     * @returns {boolean} - Success status
     */
    async addEmergencyContact(userId, contact) {
        try {
            return await userModel.addEmergencyContact(userId, contact);
        } catch (error) {
            console.error('❌ Error adding emergency contact:', error.message);
            throw new Error(`Failed to add emergency contact: ${error.message}`);
        }
    },

    /**
     * Update an emergency contact for a user
     * @param {string} userId - Firestore Document ID
     * @param {string} phone - Phone number of the contact to update
     * @param {Object} updates - Updated contact details
     * @returns {boolean} - Success status
     */
    async updateEmergencyContact(userId, phone, updates) {
        try {
            const user = await userModel.getUserById(userId);
            if (!user) throw new Error('User not found');

            const contacts = user.emergencyContacts || [];
            const contactIndex = contacts.findIndex((c) => c.phone === phone);

            if (contactIndex === -1) throw new Error('Contact not found');

            // Update contact information
            contacts[contactIndex] = { ...contacts[contactIndex], ...updates };

            return await userModel.updateEmergencyContacts(userId, contacts);
        } catch (error) {
            console.error('❌ Error updating emergency contact:', error.message);
            throw new Error(`Failed to update emergency contact: ${error.message}`);
        }
    },

    /**
     * Remove an emergency contact from a user
     * @param {string} userId - Firestore Document ID
     * @param {string} phone - Phone number of the contact to remove
     * @returns {boolean} - Success status
     */
    async removeEmergencyContact(userId, phone) {
        try {
            return await userModel.removeEmergencyContact(userId, phone);
        } catch (error) {
            console.error('❌ Error removing emergency contact:', error.message);
            throw new Error(`Failed to remove emergency contact: ${error.message}`);
        }
    },
};

module.exports = userService;
