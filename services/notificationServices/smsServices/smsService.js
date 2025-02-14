const twilio = require('twilio');
const config = require('./twilioConfig');

const client = twilio(config.accountSid, config.authToken);

class SMSService {
  async sendSMS(to, message) {
    try {
      const response = await client.messages.create({
        body: message,
        to: to,
        from: config.twilioNumber
      });
      return response;
    } catch (error) {
      throw new Error('Failed to send SMS: ' + error.message);
    }
  }

  async sendEmergencyAlerts(alert) {
    try {
      const message = `Emergency Alert: ${alert.type} - ${alert.description}`;
      const promises = alert.affectedUsers.map(user => 
        this.sendSMS(user.phone, message)
      );
      
      await Promise.all(promises);
    } catch (error) {
      throw new Error('Failed to send emergency SMS alerts: ' + error.message);
    }
  }
}

module.exports = new SMSService(); 