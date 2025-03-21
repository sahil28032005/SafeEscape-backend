const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Initialize Firebase Admin
const serviceAccount = require(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Sample disaster data
// Sample disaster data for Firestore collection 'disasters'
// Sample disaster data
// Sample disaster data
// Sample disaster data
const disasterData = [
    {
        id: "nuclear-incident-tarapur-2025",
        title: "Minor Radiation Alert at Tarapur Nuclear Plant",
        description: "Authorities report minor radiation level fluctuations at Tarapur Atomic Power Station. Situation under control but being monitored closely.",
        type: "nuclear",
        severity: "medium",
        active: true,
        location: {
          city: "Tarapur",
          state: "Maharashtra",
          latitude: 19.8298,
          longitude: 72.6580
        },
        radius: 20000, // 20km radius
        instructions: "No evacuation required. Follow official updates. Avoid approaching the facility perimeter.",
        timestamp: "2025-03-22T08:15:00Z",
        predictedEnd: "2025-03-23T20:00:00Z"
      },
      
      // Terrorist threat
      {
        id: "security-alert-mumbai-2025",
        title: "Security Alert in Mumbai",
        description: "Security agencies have issued a high alert for potential security threats in crowded areas of Mumbai. Additional security forces deployed.",
        type: "security",
        severity: "high",
        active: true,
        location: {
          city: "Mumbai",
          state: "Maharashtra",
          latitude: 18.9387,
          longitude: 72.8353
        },
        radius: 15000, // 15km radius
        instructions: "Stay vigilant in public places. Report suspicious activities or objects. Follow security personnel instructions.",
        timestamp: "2025-03-21T22:00:00Z",
        predictedEnd: "2025-03-24T22:00:00Z"
      },
      
      // Sinkhole
      {
        id: "sinkhole-nashik-2025",
        title: "Large Sinkhole Reported in Nashik",
        description: "A large sinkhole has appeared in the Nashik-Pune highway following heavy rains. Road partially collapsed and more damage possible.",
        type: "geological",
        severity: "medium",
        active: true,
        location: {
          city: "Nashik",
          state: "Maharashtra",
          latitude: 19.9975,
          longitude: 73.7898
        },
        radius: 5000, // 5km radius
        instructions: "Avoid the affected stretch of highway. Use alternative routes. Follow traffic police instructions.",
        timestamp: "2025-03-22T11:30:00Z",
        predictedEnd: "2025-03-29T23:59:00Z"
      },
      
      // Air pollution
      {
        id: "air-pollution-pune-2025",
        title: "Hazardous Air Quality in Pune",
        description: "Air quality index in Pune has reached hazardous levels due to industrial emissions and weather conditions. Visibility reduced significantly.",
        type: "pollution",
        severity: "critical",
        active: true,
        location: {
          city: "Pune",
          state: "Maharashtra",
          latitude: 18.5204,
          longitude: 73.8567
        },
        radius: 35000, // 35km radius
        instructions: "Stay indoors with windows closed. Use air purifiers if available. Wear N95 masks if going outside is necessary.",
        timestamp: "2025-03-21T09:00:00Z",
        predictedEnd: "2025-03-24T18:00:00Z"
      },
      
      // Water contamination
      {
        id: "water-contamination-aurangabad-2025",
        title: "Water Contamination Alert in Aurangabad",
        description: "Municipal authorities have detected contamination in water supply in parts of Aurangabad. Risk of waterborne diseases.",
        type: "contamination",
        severity: "high",
        active: true,
        location: {
          city: "Aurangabad",
          state: "Maharashtra",
          latitude: 19.8762,
          longitude: 75.3433
        },
        radius: 18000, // 18km radius
        instructions: "Boil water before consumption. Use bottled water if possible. Report symptoms like diarrhea or vomiting immediately.",
        timestamp: "2025-03-23T12:00:00Z",
        predictedEnd: "2025-03-26T23:59:00Z"
      },
      
      // Power outage
      {
        id: "power-outage-kolhapur-2025",
        title: "Extended Power Outage in Kolhapur",
        description: "Major power grid failure affecting Kolhapur district. Repairs underway but outage expected to last 48-72 hours.",
        type: "infrastructure",
        severity: "medium",
        active: true,
        location: {
          city: "Kolhapur",
          state: "Maharashtra",
          latitude: 16.7050,
          longitude: 74.2433
        },
        radius: 40000, // 40km radius
        instructions: "Conserve phone battery. Use emergency lighting. Check on vulnerable neighbors. Keep refrigerators closed.",
        timestamp: "2025-03-22T16:45:00Z",
        predictedEnd: "2025-03-25T16:45:00Z"
      },
      
      // Gas leak
      {
        id: "gas-leak-chembur-2025",
        title: "Gas Leak in Chembur Industrial Area",
        description: "Authorities responding to reports of gas leak from industrial facility in Chembur. Surrounding areas may experience strong odor and respiratory irritation.",
        type: "hazmat",
        severity: "high",
        active: true,
        location: {
          city: "Mumbai",
          state: "Maharashtra",
          latitude: 19.0522,
          longitude: 72.9005
        },
        radius: 12000, // 12km radius
        instructions: "Stay indoors. Close windows and doors. Cover nose and mouth with wet cloth if odor is strong. Follow evacuation orders if issued.",
        timestamp: "2025-03-23T05:30:00Z",
        predictedEnd: "2025-03-24T05:30:00Z"
      },
      
      // Bridge collapse
      {
        id: "bridge-collapse-risk-kalyan-2025",
        title: "Bridge Structural Risk in Kalyan",
        description: "Engineers have identified structural weaknesses in Kalyan railway bridge following recent flooding. Risk of partial collapse.",
        type: "structural",
        severity: "high",
        active: true,
        location: {
          city: "Kalyan",
          state: "Maharashtra",
          latitude: 19.2403,
          longitude: 73.1305
        },
        radius: 8000, // 8km radius
        instructions: "Avoid using the bridge. Use alternative routes. Follow traffic diversions. Railway services may be affected.",
        timestamp: "2025-03-22T14:15:00Z",
        predictedEnd: "2025-03-29T23:59:00Z"
      },
      
      // Locust swarm
      {
        id: "locust-swarm-jalgaon-2025",
        title: "Locust Swarm Approaching Jalgaon",
        description: "Large locust swarm moving toward agricultural areas in Jalgaon district. Significant crop damage possible in the next 24-48 hours.",
        type: "pest",
        severity: "high",
        active: true,
        location: {
          city: "Jalgaon",
          state: "Maharashtra",
          latitude: 21.0077,
          longitude: 75.5626
        },
        radius: 60000, // 60km radius
        instructions: "Farmers should implement recommended pest control measures. Cover crops where possible. Report swarm sightings to agriculture department.",
        timestamp: "2025-03-23T11:00:00Z",
        predictedEnd: "2025-03-26T23:59:00Z"
      },
      
      // Stampede risk
      {
        id: "crowd-management-pandharpur-2025",
        title: "Crowd Management Alert in Pandharpur",
        description: "Extremely large crowds expected at Pandharpur temple due to festival. Risk of overcrowding and potential stampede situations.",
        type: "crowd",
        severity: "high",
        active: true,
        location: {
          city: "Pandharpur",
          state: "Maharashtra",
          latitude: 17.6782,
          longitude: 75.3309
        },
        radius: 5000, // 5km radius
        instructions: "Follow designated entry/exit routes. Stay with your group. Follow police instructions. Elderly and children should avoid peak hours.",
        timestamp: "2025-03-25T00:00:00Z",
        predictedEnd: "2025-03-26T23:59:00Z"
      },
      
      // Train derailment
      {
        id: "train-derailment-risk-igatpuri-2025",
        title: "Train Derailment Risk Near Igatpuri",
        description: "Railway authorities report track damage near Igatpuri following landslides. Trains operating at reduced speed. Risk of derailment exists.",
        type: "transportation",
        severity: "medium",
        active: true,
        location: {
          city: "Igatpuri",
          state: "Maharashtra",
          latitude: 19.6958,
          longitude: 73.5634
        },
        radius: 15000, // 15km radius
        instructions: "Check train status before travel. Expect delays. Consider alternative transportation if possible.",
        timestamp: "2025-03-22T13:30:00Z",
        predictedEnd: "2025-03-24T23:59:00Z"
      }
];

async function seedDisasterData() {
  try {
    console.log('Starting to seed disaster data...');
    
    const batch = db.batch();
    
    // Add each disaster to the batch
    disasterData.forEach(disaster => {
      const docRef = db.collection('disasters').doc(disaster.id);
      batch.set(docRef, disaster);
    });
    
    // Commit the batch
    await batch.commit();
    
    console.log(`Successfully added ${disasterData.length} disasters to Firestore`);
  } catch (error) {
    console.error('Error seeding disaster data:', error);
  } finally {
    // Close the connection
    process.exit(0);
  }
}

seedDisasterData();