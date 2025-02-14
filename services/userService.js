const { db, collections, fieldValues } = require('../config/firebase-config');

const userService = {
    async createUser(userData) {
        try {
            const userDoc = await collections.users.add({
                ...userData,
                createdAt: fieldValues.serverTimestamp(),
                updatedAt: fieldValues.serverTimestamp()
            });
            return userDoc.id;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    async updateUser(userId, updates) {
        try {
            await collections.users.doc(userId).update({
                ...updates,
                updatedAt: fieldValues.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }
};

module.exports = userService; 