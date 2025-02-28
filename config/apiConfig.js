require('dotenv').config();

const config = {
    google: {
        mapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace('/\\n/g', '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    },
    openWeather: {
        // apiKey: process.env.OPENWEATHER_API_KEY,
    }
};
module.exports = config; 