const { db, collections, fieldValues } = require('../config/firebase-config');

const userModel = {
  /**
   * Create a new user in Firestore (with embedded emergency contacts)
   * @param {Object} userData - User details
   * @returns {string} userId - Firestore document ID
   */
  async createUser(userData) {
    try {
      const userRef = await collections.users.add({
        name: userData.name,
        email: userData.email,
        password: userData.password, // Ensure to hash this before storing
        phone: userData.phone || null,
        location: userData.location || null,
        fcmTokens: userData.fcmTokens || [],
        emergencyContacts: userData.emergencyContacts || [
          { name: 'Police', phone: '112', relationship: 'Emergency', priority: 1 },
          { name: 'Fire Brigade', phone: '101', relationship: 'Emergency', priority: 2 },
          { name: 'Ambulance', phone: '108', relationship: 'Emergency', priority: 3 }
        ],
        createdAt: fieldValues.serverTimestamp(),
        updatedAt: fieldValues.serverTimestamp(),
      });

      return userRef.id;
    } catch (error) {
      console.error('❌ Error creating user:', error.message);
      throw new Error('Failed to create user');
    }
  },
  /**
   * Get user details by Email
   * @param {string} email - User's email address
   * @returns {Object|null} - User data or null if not found
   */
  async getUserByEmail(email) {
    try {
      const snapshot = await collections.users
        .where('email', '==', email)
        .limit(1) // Optimize query with limit
        .get();

      if (snapshot.empty) return null; // No user found

      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    } catch (error) {
      console.error('❌ Error fetching user by email:', error.message);
      throw new Error('Failed to get user by email');
    }
  },
  /**
   * Get user details by ID (with embedded emergency contacts)
   * @param {string} userId - Firestore document ID
   * @returns {Object|null} - User data or null if not found
   */
  async getUserById(userId) {
    try {
      const userDoc = await collections.users.doc(userId).get();
      if (!userDoc.exists) return null;

      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      console.error('❌ Error fetching user by ID:', error.message);
      throw new Error('Failed to get user');
    }
  },

  /**
   * Update emergency contacts for a user
   * @param {string} userId - Firestore document ID
   * @param {Array} contacts - Array of emergency contacts
   * @returns {boolean} - Success status
   */
  async updateEmergencyContacts(userId, contacts) {
    try {
      const userRef = collections.users.doc(userId);
      await userRef.update({
        emergencyContacts: contacts,
        updatedAt: fieldValues.serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('❌ Error updating emergency contacts:', error.message);
      throw new Error('Failed to update emergency contacts');
    }
  },

  /**
   * Add a new emergency contact to a user
   * @param {string} userId - Firestore document ID
   * @param {Object} contact - Emergency contact to add
   * @returns {boolean} - Success status
   */
  async addEmergencyContact(userId, contact) {
    try {
      const userRef = collections.users.doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) throw new Error('User not found');

      const currentContacts = userDoc.data().emergencyContacts || [];

      // Ensure no duplicate contact based on phone number
      if (!currentContacts.some((c) => c.phone === contact.phone)) {
        currentContacts.push(contact);
        await userRef.update({
          emergencyContacts: currentContacts,
          updatedAt: fieldValues.serverTimestamp(),
        });
      }

      return true;
    } catch (error) {
      console.error('❌ Error adding emergency contact:', error.message);
      throw new Error('Failed to add emergency contact');
    }
  },

  /**
   * Remove an emergency contact from a user
   * @param {string} userId - Firestore document ID
   * @param {string} phone - Phone number to remove
   * @returns {boolean} - Success status
   */
  async removeEmergencyContact(userId, phone) {
    try {
      const userRef = collections.users.doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) throw new Error('User not found');

      const updatedContacts = (userDoc.data().emergencyContacts || []).filter(
        (contact) => contact.phone !== phone
      );

      await userRef.update({
        emergencyContacts: updatedContacts,
        updatedAt: fieldValues.serverTimestamp(),
      });

      return true;
    } catch (error) {
      console.error('❌ Error removing emergency contact:', error.message);
      throw new Error('Failed to remove emergency contact');
    }
  },
};

module.exports = userModel;
