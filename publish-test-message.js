require('dotenv').config();
const pubSubService = require('./services/pubsub/pubSubService');

async function publishTestMessage() {
  try {
    // Initialize Pub/Sub
    await pubSubService.initialize();
    
    // Get topics
    const topics = pubSubService.getTopics();
    
    // Create test alert
    const testAlert = {
      id: `alert-${Date.now()}`,
      title: 'TEST ALERT: Buffer Fix Test',
      message: 'Testing after fixing the Buffer issue.',
      type: 'test',
      severity: 'high',
      location: {
        city: 'Mumbai',
        state: 'Maharashtra',
        lat: 19.0760,
        lng: 72.8777
      },
      timestamp: new Date().toISOString(),
      status: 'active'
    };
    
    // Publish to emergency alerts topic
    const messageId = await pubSubService.publishMessage(
      topics.EMERGENCY_ALERTS,
      testAlert,
      {
        severity: 'high',
        type: 'test',
        region: 'Mumbai,Maharashtra'
      }
    );
    
    console.log(`Test message published with ID: ${messageId}`);
  } catch (error) {
    console.error('Error publishing test message:', error);
  }
}

publishTestMessage();