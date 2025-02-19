// const mongoose = require('mongoose');

// const emergencyContactSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   name: { type: String, required: true },
//   phone: { type: String, required: true },
//   relationship: String,
//   priority: { type: Number, default: 1 }
// });

// module.exports = mongoose.model('EmergencyContact', emergencyContactSchema); 
const { db, collections, fieldValues } = require("../config/firebase-config");

const EmergencyContact = {
  /**
   * Create a new emergency contact
   * @param {Object} contactData - { userId, name, phone, relationship, priority }
   * @returns {Object} - Created contact with ID
   */
  async create(contactData) {
    try {
      const docRef = await collections.emergencyContacts.add({
        ...contactData,
        createdAt: fieldValues.serverTimestamp(),
        updatedAt: fieldValues.serverTimestamp(),
      });
      return { id: docRef.id, ...contactData };
    } catch (error) {
      console.error("❌ Error creating emergency contact:", error.message);
      throw new Error(`Failed to create emergency contact: ${error.message}`);
    }
  },

  /**
   * Get all emergency contacts for a user
   * @param {string} userId - Firestore User ID
   * @returns {Array} - List of contacts
   */
  async getByUserId(userId) {
    try {
      const snapshot = await collections.emergencyContacts.where("userId", "==", userId).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("❌ Error fetching emergency contacts:", error.message);
      throw new Error(`Failed to fetch emergency contacts: ${error.message}`);
    }
  },

  /**
   * Get an emergency contact by ID
   * @param {string} id - Firestore Document ID
   * @returns {Object} - Emergency Contact
   */
  async getById(id) {
    try {
      const doc = await collections.emergencyContacts.doc(id).get();
      if (!doc.exists) {
        throw new Error("Emergency contact not found");
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error(`❌ Error fetching emergency contact ${id}:`, error.message);
      throw new Error(`Failed to fetch emergency contact: ${error.message}`);
    }
  },

  /**
   * Update an emergency contact
   * @param {string} id - Firestore Document ID
   * @param {Object} updateData - Fields to update
   * @returns {Object} - Updated contact
   */
  async update(id, updateData) {
    try {
      await collections.emergencyContacts.doc(id).update({
        ...updateData,
        updatedAt: fieldValues.serverTimestamp(),
      });
      return { id, ...updateData };
    } catch (error) {
      console.error(`❌ Error updating emergency contact ${id}:`, error.message);
      throw new Error(`Failed to update emergency contact: ${error.message}`);
    }
  },

  /**
   * Delete an emergency contact
   * @param {string} id - Firestore Document ID
   * @returns {string} - Deleted contact ID
   */
  async delete(id) {
    try {
      await collections.emergencyContacts.doc(id).delete();
      return id;
    } catch (error) {
      console.error(`❌ Error deleting emergency contact ${id}:`, error.message);
      throw new Error(`Failed to delete emergency contact: ${error.message}`);
    }
  }
};

module.exports = EmergencyContact;
