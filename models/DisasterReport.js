const mongoose = require('mongoose');
const { db, collections, fieldValues } = require("../config/firebase-config");

const disasterReportSchema = new mongoose.Schema({
  type: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  severity: { type: Number, required: true },
  description: String,
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  images: [String],
  timestamp: { type: Date, default: Date.now }
});

const DisasterReport = {
    async create(reportData) {
        try {
            const docRef = await collections.emergencies.add({
                ...reportData,
                createdAt: fieldValues.serverTimestamp(),
                status: 'active',
                updatedAt: fieldValues.serverTimestamp()
            });
            return { id: docRef.id, ...reportData };
        } catch (error) {
            console.error('Error creating disaster report:', error);
            throw new Error(`Failed to create disaster report: ${error.message}`);
        }
    },

    async getAll() {
        try {
            const snapshot = await collections.emergencies
                .orderBy('createdAt', 'desc')
                .get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching disaster reports:', error);
            throw new Error(`Failed to fetch disaster reports: ${error.message}`);
        }
    },

    async getById(id) {
        try {
            const doc = await collections.emergencies.doc(id).get();
            if (!doc.exists) {
                throw new Error('Disaster report not found');
            }
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            console.error(`Error fetching disaster report ${id}:`, error);
            throw new Error(`Failed to fetch disaster report: ${error.message}`);
        }
    },

    async update(id, updateData) {
        try {
            await collections.emergencies.doc(id).update({
                ...updateData,
                updatedAt: fieldValues.serverTimestamp()
            });
            return { id, ...updateData };
        } catch (error) {
            console.error(`Error updating disaster report ${id}:`, error);
            throw new Error(`Failed to update disaster report: ${error.message}`);
        }
    }
};

module.exports = { DisasterReport, mongoose }; 