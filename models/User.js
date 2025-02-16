// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   fcmTokens: [
//     {
//       token: { type: String }
//     }
//   ],
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   phone: { type: String },
//   location: {
//     type: { type: String, default: 'Point' },
//     coordinates: [Number]
//   },
//   emergencyContacts: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'EmergencyContact'
//   }],
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('User', userSchema); 
const { db, collections, fieldValues } = require('../config/firebase-config');

const userModel = {
  /**
   * Create a new user in Firestore
   * @param {Object} userData - User details
   * @returns {string} userId - Firestore document ID
   */
  async createUser(userData) {
    try {
      const userRef = await collections.users.add({
        name: userData.name,
        email: userData.email,
        password: userData.password,  // 🔹 Hash before storing
        phone: userData.phone || null,
        location: userData.location || null,
        emergencyContacts: userData.emergencyContacts || [],
        fcmTokens: userData.fcmTokens || [],
        createdAt: fieldValues.serverTimestamp(),
        updatedAt: fieldValues.serverTimestamp()
      });
      return userRef.id;
    } catch (error) {
      console.error('❌ Error creating user:', error.message);
      throw new Error('Failed to create user');
    }
  },

  /**
   * Get user details by Email
   * @param {string} email - User email
   * @returns {Object|null} - User data or null if not found
   */
  async getUserByEmail(email) {
    try {
      const snapshot = await collections.users.where('email', '==', email).get();
      if (snapshot.empty) return null; // No user found
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    } catch (error) {
      console.error('❌ Error fetching user by email:', error.message);
      throw new Error('Failed to get user');
    }
  },

  /**
   * Get user details by ID
   * @param {string} userId - Firestore document ID
   * @returns {Object|null} - User data or null if not found
   */
  async getUserById(userId) {
    try {
      const userDoc = await collections.users.doc(userId).get();
      return userDoc.exists ? { id: userDoc.id, ...userDoc.data() } : null;
    } catch (error) {
      console.error('❌ Error fetching user by ID:', error.message);
      throw new Error('Failed to get user');
    }
  },

  /**
   * Update an existing user in Firestore
   * @param {string} userId - Firestore document ID
   * @param {Object} updates - Fields to update
   * @returns {boolean} - Success status
   */
  async updateUser(userId, updates) {
    try {
      const userRef = collections.users.doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) throw new Error(`User with ID ${userId} not found`);

      await userRef.update({
        ...updates,
        updatedAt: fieldValues.serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error('❌ Error updating user:', error.message);
      throw new Error('Failed to update user');
    }
  },

  /**
   * Add an FCM token to a user
   * @param {string} userId
   * @param {string} fcmToken
   */
  async addFcmToken(userId, fcmToken) {
    try {
      const userRef = collections.users.doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) throw new Error('User not found');

      let fcmTokens = userDoc.data().fcmTokens || [];

      // 🔹 Prevent duplicate tokens
      if (!fcmTokens.includes(fcmToken)) {
        fcmTokens.push(fcmToken);
        await userRef.update({ fcmTokens });
      }
    } catch (error) {
      console.error('❌ Error adding FCM token:', error.message);
      throw new Error('Failed to add FCM token');
    }
  },

  /**
   * Remove an FCM token from a user
   * @param {string} userId
   * @param {string} fcmToken
   */
  async removeFcmToken(userId, fcmToken) {
    try {
      const userRef = collections.users.doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) throw new Error('User not found');

      let fcmTokens = (userDoc.data().fcmTokens || []).filter(token => token !== fcmToken);
      await userRef.update({ fcmTokens });
    } catch (error) {
      console.error('❌ Error removing FCM token:', error.message);
      throw new Error('Failed to remove FCM token');
    }
  }
};

module.exports = userModel;
