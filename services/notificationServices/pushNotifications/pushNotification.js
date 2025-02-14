const admin = require('../../../config/firebase-config');

class PushNotificationService {
  async sendToUser(userId, notification) {
    try {
      const message = {
        notification: {
          title: notification.title,
          body: notification.body
        },
        token: userId
      };

      const response = await admin.messaging().send(message);
      return response;
    } catch (error) {
      throw new Error('Failed to send push notification: ' + error.message);
    }
  }

  async sendToAffectedUsers(alert) {
    try {
      const messages = alert.affectedUsers.map(userId => ({
        notification: {
          title: `Emergency Alert: ${alert.type}`,
          body: alert.description
        },
        token: userId
      }));

      const response = await admin.messaging().sendAll(messages);
      return response;
    } catch (error) {
      throw new Error('Failed to send bulk notifications: ' + error.message);
    }
  }
}

module.exports = new PushNotificationService(); 