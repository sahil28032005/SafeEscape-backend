const Alert = require('../models/Alert');
const pushNotificationService = require('../services/notificationServices/pushNotifications/pushNotification');
const smsService = require('../services/notificationServices/smsServices/smsService');

class AlertController {
  async createAlert(req, res) {
    try {
      const alert = new Alert(req.body);
      await alert.save();

      // Send notifications
      await pushNotificationService.sendToAffectedUsers(alert);
      await smsService.sendEmergencyAlerts(alert);

      res.status(201).json(alert);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getActiveAlerts(req, res) {
    try {
      const alerts = await Alert.find()
        .sort({ timestamp: -1 })
        .limit(10);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AlertController(); 