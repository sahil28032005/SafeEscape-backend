const { GoogleAuth } = require("google-auth-library");
const axios = require("axios");
require("dotenv").config();
const path = require("path");

async function getAccessToken() {
    try {
        const auth = new GoogleAuth({
            keyFilename: path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS),
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
        });

        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();
        return accessToken.token;
    } catch (error) {
        console.error("❌ Error getting access token:", error);
    }
}

async function testGeminiAPI() {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        console.error("❌ Failed to obtain access token.");
        return;
    }

    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };

    // ✅ Corrected Payload Format  
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
