const axios = require("axios");
require("dotenv").config();

async function testGeminiAPI() {
    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        console.error("❌ GEMINI_API_KEY not found in environment variables");
        return;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${apiKey}`;
    const headers = {
        "Content-Type": "application/json",
    };

    const requestData = {
        contents: [
            {
                role: "user",
                parts: [{ text: "What to do in case of an earthquake?" }]
            }
        ]
    };

    try {
        const response = await axios.post(apiUrl, requestData, { headers });
        console.log("✅ Gemini API Response:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("❌ Error calling Gemini API:", error.response?.data || error.message);
    }
}

testGeminiAPI();
