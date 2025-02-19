require('dotenv').config();
console.log(process.env.TWILIO_ACCOUNT_SID)
console.log(process.env.TWILIO_NUMBER)
module.exports = {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    twilioNumber: process.env.TWILIO_NUMBER
};
