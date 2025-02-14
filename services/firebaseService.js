const admin = require('../config/firebase-config');
const db = admin.firestore();

const firebaseService = {
    // Save emergency data
    async saveEmergencyData(userId, data) {
        try {
            await db.collection('emergencies').doc(userId).set(data, { merge: true });
            return true;
        } catch (error) {
            console.error('Error saving emergency data:', error);
            throw error;
        }
    },

    // Get emergency data
    async getEmergencyData(userId) {
        try {
            const doc = await db.collection('emergencies').doc(userId).get();
            if (!doc.exists) {
                return null;
            }
            return doc.data();
        } catch (error) {
            console.error('Error getting emergency data:', error);
            throw error;
        }
    },

    // Update emergency data
    async updateEmergencyData(userId, data) {
        try {
            await db.collection('emergencies').doc(userId).update(data);
            return true;
        } catch (error) {
            console.error('Error updating emergency data:', error);
            throw error;
        }
    },

    // Delete emergency data
    async deleteEmergencyData(userId) {
        try {
            await db.collection('emergencies').doc(userId).delete();
            return true;
        } catch (error) {
            console.error('Error deleting emergency data:', error);
            throw error;
        }
    },

    // Query emergency data (example with filters)
    async queryEmergencies(filters) {
        try {
            let query = db.collection('emergencies');

            // Apply filters
            if (filters.type) {
                query = query.where('type', '==', filters.type);
            }
            if (filters.status) {
                query = query.where('status', '==', filters.status);
            }

            const snapshot = await query.get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error querying emergencies:', error);
            throw error;
        }
    }
};

module.exports = firebaseService; 