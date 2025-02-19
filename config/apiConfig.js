require('dotenv').config();

const config = {
    google: {
        mapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? 
            process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : 
            undefined,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    },
    openWeather: {
        apiKey: process.env.OPENWEATHER_API_KEY,
    }
};

// Validate required configuration
if (!config.google.mapsApiKey) {
    console.warn('⚠️ Warning: Google Maps API key is not set');
}
if (!config.openWeather.apiKey) {
    console.warn('⚠️ Warning: OpenWeather API key is not set');
}

// Since you're using serviceAccountKey.json, we don't need to validate Firebase config
// The Firebase initialization is handled by firebase-config.js

module.exports = config; 