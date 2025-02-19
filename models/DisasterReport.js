// const mongoose = require('mongoose');
// const { db, collections, fieldValues } = require("../config/firebase-config");

// const disasterReportSchema = new mongoose.Schema({
//     type: { type: String, required: true },
//     location: {
//         type: { type: String, default: 'Point' },
//         coordinates: [Number]
//     },
//     severity: { type: Number, required: true },
//     description: String,
//     reportedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     images: [String],
//     timestamp: { type: Date, default: Date.now }
// });

// const DisasterReport = {
//     async create(reportData) {
//         try {
//             const docRef = await collections.emergencies.add({
//                 ...reportData,
//                 createdAt: fieldValues.serverTimestamp(),
//                 status: 'active',
//                 updatedAt: fieldValues.serverTimestamp()
//             });
//             return { id: docRef.id, ...reportData };
//         } catch (error) {
//             console.error('Error creating disaster report:', error);
//             throw new Error(`Failed to create disaster report: ${error.message}`);
//         }
//     },

//     async getAll() {
//         try {
//             const snapshot = await collections.emergencies
//                 .orderBy('createdAt', 'desc')
//                 .get();
//             return snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data()
//             }));
//         } catch (error) {
//             console.error('Error fetching disaster reports:', error);
//             throw new Error(`Failed to fetch disaster reports: ${error.message}`);
//         }
//     },

//     async getById(id) {
//         try {
//             const doc = await collections.emergencies.doc(id).get();
//             if (!doc.exists) {
//                 throw new Error('Disaster report not found');
//             }
//             return { id: doc.id, ...doc.data() };
//         } catch (error) {
//             console.error(`Error fetching disaster report ${id}:`, error);
//             throw new Error(`Failed to fetch disaster report: ${error.message}`);
//         }
//     },

//     async update(id, updateData) {
//         try {
//             await collections.emergencies.doc(id).update({
//                 ...updateData,
//                 updatedAt: fieldValues.serverTimestamp()
//             });
//             return { id, ...updateData };
//         } catch (error) {
//             console.error(`Error updating disaster report ${id}:`, error);
//             throw new Error(`Failed to update disaster report: ${error.message}`);
//         }
//     }
// };

// module.exports = DisasterReport; 
const admin = require('../config/firebase-config');
const db = admin.admin.firestore();
const fieldValues = admin.fieldValues;

class DisasterReportService {
    /**
     * Create a new disaster report
     * @param {Object} reportData - Disaster report details
     * @returns {Promise<Object>} - Saved report document
     */
    async create(reportData) {
        try {
            const docRef = db.collection('disasterReports').doc();
            const newReport = {
                type: reportData.type,
                location: {
                    type: 'Point',
                    coordinates: reportData.coordinates || []
                },
                severity: reportData.severity,
                description: reportData.description || '',
                reportedBy: reportData.reportedBy || null,
                images: reportData.images || [],
                timestamp: fieldValues.serverTimestamp(),
                status: 'active',
                updatedAt: fieldValues.serverTimestamp()
            };

            await docRef.set(newReport);
            return { id: docRef.id, ...newReport };
        } catch (error) {
            console.error('❌ Error creating disaster report:', error.message);
            throw new Error(`Failed to create disaster report: ${error.message}`);
        }
    }

    /**
     * Get all disaster reports
     * @returns {Promise<Array>} - List of reports
     */
    async getAll() {
        try {
            const snapshot = await db.collection('disasterReports')
                .orderBy('timestamp', 'desc')
                .get();

            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('❌ Error fetching disaster reports:', error.message);
            throw new Error(`Failed to fetch disaster reports: ${error.message}`);
        }
    }

    /**
     * Get a disaster report by ID
     * @param {string} id - Report document ID
     * @returns {Promise<Object|null>} - Report data or null if not found
     */
    async getById(id) {
        try {
            const doc = await db.collection('disasterReports').doc(id).get();
            if (!doc.exists) return null;
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            console.error(`❌ Error fetching disaster report ${id}:`, error.message);
            throw new Error(`Failed to fetch disaster report: ${error.message}`);
        }
    }

    /**
     * Update an existing disaster report
     * @param {string} id - Report document ID
     * @param {Object} updateData - Data to update
     */
    async update(id, updateData) {
        try {
            await db.collection('disasterReports').doc(id).update({
                ...updateData,
                updatedAt: fieldValues.serverTimestamp()
            });

            return { id, ...updateData };
        } catch (error) {
            console.error(`❌ Error updating disaster report ${id}:`, error.message);
            throw new Error(`Failed to update disaster report: ${error.message}`);
        }
    }
}

module.exports = new DisasterReportService();
