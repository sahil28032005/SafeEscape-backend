require('dotenv').config();
const pubSubService = require('./services/pubsub/pubSubService');
const alertService = require('./services/alerts/alertService');

// Test data
const testLocation = {
  city: 'Mumbai',
  state: 'Maharashtra',
  lat: 19.0760,
  lng: 72.8777
};

const testAlert = {
  title: 'TEST ALERT: Flood Warning',
  message: 'This is a test flood warning for Mumbai area. Please disregard.',
  type: 'flood',
  severity: 'high',
  location: testLocation,
  region: 'Mumbai,Maharashtra'
};

const testEvacuation = {
  area: {
    name: 'South Mumbai',
    region: 'Mumbai,Maharashtra',
    center: {
      lat: 18.9387,
      lng: 72.8353
    },
    radius: 5000 // 5km
  },
  reason: 'TEST: Simulated flooding in low-lying areas',
  instructions: 'This is a test evacuation notice. Please disregard.',
  severity: 'high',
  safeLocations: [
    {
      name: 'Test Evacuation Center',
      address: '123 Test Street',
      lat: 19.0170,
      lng: 72.8570
    }
  ]
};

/**
 * Run Alert Service tests
 */
async function runTests() {
  console.log('🧪 TESTING ALERT SERVICE FOR SAFEESCAPE 🧪');
  console.log('=========================================');
  console.log('Project ID:', process.env.GOOGLE_CLOUD_PROJECT_ID);
  console.log('=========================================\n');

  try {
    // Initialize Pub/Sub first
    await pubSubService.initialize();
    
    // Test 1: Create Emergency Alert
    await testCreateAlert();
    
    // Test 2: Create Evacuation Notice
    await testCreateEvacuation();
    
    // Test 3: Generate Disaster Warning
    await testGenerateWarning();
    
    console.log('\n✅ ALL TESTS COMPLETED SUCCESSFULLY');
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
  }
}

/**
 * Test creating an emergency alert
 */
async function testCreateAlert() {
  console.log('📝 Test 1: Create Emergency Alert');
  
  try {
    const alertId = await alertService.createEmergencyAlert(testAlert);
    console.log(`✅ Emergency alert created with ID: ${alertId}\n`);
  } catch (error) {
    console.error('❌ Creating emergency alert failed:', error);
    throw error;
  }
}

/**
 * Test creating an evacuation notice
 */
async function testCreateEvacuation() {
  console.log('📝 Test 2: Create Evacuation Notice');
  
  try {
    const noticeId = await alertService.createEvacuationNotice(testEvacuation);
    console.log(`✅ Evacuation notice created with ID: ${noticeId}\n`);
  } catch (error) {
    console.error('❌ Creating evacuation notice failed:', error);
    throw error;
  }
}

/**
 * Test generating a disaster warning
 */
async function testGenerateWarning() {
  console.log('📝 Test 3: Generate Disaster Warning');
  
  try {
    const warnings = await alertService.generateDisasterWarning(testLocation);
    
    if (!warnings || warnings.length === 0) {
      console.log('✅ No high-risk disasters predicted (this is normal if there are no current risks)\n');
    } else {
      console.log(`✅ Generated ${warnings.length} disaster warnings:`);
      warnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning.title}`);
      });
      console.log();
    }
  } catch (error) {
    console.error('❌ Generating disaster warning failed:', error);
    throw error;
  }
}

// Run the tests
runTests(); 