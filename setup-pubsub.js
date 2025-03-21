require('dotenv').config();
const { PubSub } = require('@google-cloud/pubsub');

// Topic names
const TOPICS = {
  EMERGENCY_ALERTS: 'emergency-alerts',
  DISASTER_WARNINGS: 'disaster-warnings',
  EVACUATION_NOTICES: 'evacuation-notices',
  SYSTEM_NOTIFICATIONS: 'system-notifications'
};

// Subscription names
const SUBSCRIPTIONS = {
  EMERGENCY_ALERTS_SUB: 'emergency-alerts-subscription',
  DISASTER_WARNINGS_SUB: 'disaster-warnings-subscription',
  EVACUATION_NOTICES_SUB: 'evacuation-notices-subscription',
  SYSTEM_NOTIFICATIONS_SUB: 'system-notifications-subscription'
};

async function setupPubSub() {
  try {
    console.log('Setting up Pub/Sub topics and subscriptions...');
    
    // Initialize the client
    const pubsub = new PubSub({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
    
    // Create topics
    for (const [key, topicName] of Object.entries(TOPICS)) {
      try {
        const [exists] = await pubsub.topic(topicName).exists();
        if (!exists) {
          await pubsub.createTopic(topicName);
          console.log(`Topic ${topicName} created.`);
        } else {
          console.log(`Topic ${topicName} already exists.`);
        }
      } catch (error) {
        console.error(`Error creating topic ${topicName}:`, error);
      }
    }
    
    // Create subscriptions
    for (const [key, subscriptionName] of Object.entries(SUBSCRIPTIONS)) {
      try {
        const topicName = TOPICS[key.replace('_SUB', '')];
        const topic = pubsub.topic(topicName);
        const subscription = topic.subscription(subscriptionName);
        
        const [exists] = await subscription.exists();
        if (!exists) {
          await topic.createSubscription(subscriptionName, {
            ackDeadlineSeconds: 60,
            expirationPolicy: {}, // Never expire
            retainAckedMessages: false,
            messageRetentionDuration: { seconds: 86400 } // 24 hours
          });
          console.log(`Subscription ${subscriptionName} created for topic ${topicName}.`);
        } else {
          console.log(`Subscription ${subscriptionName} already exists.`);
        }
      } catch (error) {
        console.error(`Error creating subscription ${subscriptionName}:`, error);
      }
    }
    
    console.log('\n✅ Pub/Sub setup completed successfully!');
  } catch (error) {
    console.error('\n❌ Pub/Sub setup failed:', error);
  }
}

setupPubSub(); 