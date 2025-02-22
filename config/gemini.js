const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const { readFileSync } = require('fs');

const serviceAccountPath = path.join(__dirname, 'config\gemini-servie-account.json'); // Adjust the path as necessary
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath));

const genAI = new GoogleGenerativeAI({
    credentials: serviceAccount
});

// Now you can use genAI to interact with the Gemini API
