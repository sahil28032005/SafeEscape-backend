const twilio = require('twilio');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const config = require('../../../config/twillioConfig'); // ✅ Import config

// Initialize Twilio client with imported config
const client = twilio(config.accountSid, config.authToken);
if (!config.accountSid || !config.authToken) {
  throw new Error("🚨 Twilio credentials are missing! Check your .env file.");
}
class SMSService {
  /**
   * Formats phone number to E.164 (global format)
   * @param {string} phone - User's phone number
   * @param {string} countryCode - User's country code (e.g., "US", "IN")
   * @returns {string|null} - Formatted number or null if invalid
   */
  formatPhoneNumber(phone, countryCode) {
    try {
      const number = phoneUtil.parseAndKeepRawInput(phone, countryCode);
      if (!phoneUtil.isValidNumber(number)) throw new Error("Invalid phone number");
      return phoneUtil.format(number, 0); // Correct E.164 format
    } catch (error) {
      console.error(`❌ Invalid phone number (${phone} - ${countryCode}): ${error.message}`);
      return null;
    }
  }

  /**
   * Sends an SMS globally with formatted phone numbers
   * @param {string} phone - User's phone number
   * @param {string} countryCode - Country code (e.g., "US", "IN")
   * @param {string} message - SMS message body
   */
  async sendSMS(phone, countryCode, message) {
    try {
      const formattedPhone = this.formatPhoneNumber(phone, countryCode);
      if (!formattedPhone) return { success: false, error: "Invalid phone number" };

      const response = await client.messages.create({
        body: message,
        to: formattedPhone,
        from: config.twilioNumber // ✅ Using config
      });

      console.log(`✅ SMS sent to ${formattedPhone}: ${response.sid}`);
      return { success: true, response };
    } catch (error) {
      console.error(`❌ Failed to send SMS to ${phone}: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Sends emergency SMS alerts to multiple users globally
   * @param {Object} alert - Alert details (type, description, affectedUsers)
   */
  async sendEmergencyAlerts(alert) {
    try {
      const message = `🚨 Emergency Alert: ${alert.type} - ${alert.description}`;
      const results = await Promise.all(
        alert.affectedUsers.map(user => this.sendSMS(user.phone, user.countryCode, message))
      );

      // Separate successes and failures
      const successCount = results.filter(res => res.success).length;
      const failureCount = results.length - successCount;

      console.log(`✅ ${successCount} alerts sent successfully`);
      if (failureCount > 0) {
        console.warn(`⚠️ ${failureCount} alerts failed to send`);
      }

      return { successCount, failureCount, results };
    } catch (error) {
      console.error(`❌ Failed to send emergency alerts: ${error.message}`);
      throw new Error(error.message);
    }
  }
}

module.exports = new SMSService();
