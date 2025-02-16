// const admin = require('../../../config/firebase-config');

// class PushNotificationService {
//   async sendToUser(userId, notification) {
//     try {
//       const message = {
//         notification: {
//           title: notification.title,
//           body: notification.body
//         },
//         token: userId
//       };

//       const response = await admin.messaging().send(message);
//       return response;
//     } catch (error) {
//       throw new Error('Failed to send push notification: ' + error.message);
//     }
//   }

//   async sendToAffectedUsers(alert) {
//     try {
//       const messages = alert.affectedUsers.map(userId => ({
//         notification: {
//           title: `Emergency Alert: ${alert.type}`,
//           body: alert.description
//         },
//         token: userId
//       }));

//       const response = await admin.messaging().sendAll(messages);
//       return response;
//     } catch (error) {
//       throw new Error('Failed to send bulk notifications: ' + error.message);
//     }
//   }
// }

// module.exports = new PushNotificationService(); 
const admin = require('../../../config/firebase-config');
const { collections } = require('../../../config/firebase-config');

class PushNotificationService {
  /**
   * Send a push notification to a specific user
   * @param {string} userId - Firestore user ID
   * @param {Object} notification - Notification details { title, body }
   */
  async sendToUser(userId, notification) {
    try {
      // Fetch user from Firestore
      const userDoc = await collections.users.doc(userId).get();
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const user = userDoc.data();
      if (!user.fcmTokens || user.fcmTokens.length === 0) {
        throw new Error('No FCM token found for this user');
      }

      // Prepare messages for all user tokens
      const messages = user.fcmTokens.map(token => ({
        notification: {
          title: notification.title,
          body: notification.body
        },
        token
      }));

      // Send notifications
      const response = await admin.messaging().sendAll(messages);
      return response;
    } catch (error) {
      console.error('❌ Error sending push notification:', error.message);
      throw new Error('Failed to send push notification: ' + error.message);
    }
  }

  /**
   * Send a push notification to multiple affected users
   * @param {Object} alert - Alert object { type, description, affectedUsers }
   */
  async sendToAffectedUsers(alert) {
    try {
      const userTokens = [];

      // Fetch all affected users' FCM tokens
      for (const userId of alert.affectedUsers) {
        const userDoc = await collections.users.doc(userId).get();
        if (userDoc.exists) {
          const user = userDoc.data();
          if (user.fcmTokens && user.fcmTokens.length > 0) {
            userTokens.push(...user.fcmTokens);
          }
        }
      }

      if (userTokens.length === 0) {
        throw new Error('No FCM tokens found for affected users');
      }

      // Prepare messages
      const messages = userTokens.map(token => ({
        notification: {
          title: `🚨 Emergency Alert: ${alert.type}`,
          body: alert.description
        },
        token
      }));

      // Send notifications
      const response = await admin.messaging().sendAll(messages);
      return response;
    } catch (error) {
      console.error('❌ Error sending bulk notifications:', error.message);
      throw new Error('Failed to send bulk notifications: ' + error.message);
    }
  }
}

module.exports = new PushNotificationService();
