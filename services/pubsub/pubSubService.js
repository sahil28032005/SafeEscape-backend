const { PubSub } = require('@google-cloud/pubsub');
require('dotenv').config();
const fs = require('fs');

// Initialize Pub/Sub client with better error handling
let pubsub;
try {
  // Check if credentials file exists
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credentialsPath && fs.existsSync(credentialsPath)) {
    console.log(`Using credentials from: ${credentialsPath}`);
    pubsub = new PubSub({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: credentialsPath
    });
  } else {
    console.warn(`Credentials file not found at: ${credentialsPath}`);
    console.log('Falling back to application default credentials');
    pubsub = new PubSub({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
    });
  }
  
  // Check for emulator
  if (process.env.PUBSUB_EMULATOR_HOST) {
    console.warn(`⚠️ PUBSUB_EMULATOR_HOST is set to ${process.env.PUBSUB_EMULATOR_HOST}`);
    console.warn('This will cause Pub/Sub to connect to a local emulator instead of Google Cloud');
  }
} catch (error) {
  console.error('Error initializing Pub/Sub client:', error);
  // Create a mock pubsub client for fallback
  pubsub = {
    topic: () => ({
      exists: async () => [false],
      createTopic: async () => {},
      createSubscription: async () => {},
      publish: async () => 'mock-message-id',
      subscription: () => ({
        exists: async () => [false],
        on: () => {}
      })
    }),
    getTopics: async () => [[]]
  };
}

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

/**
 * Pub/Sub service for real-time alerts and notifications
 */
const pubSubService = {
  /**
   * Initialize topics and subscriptions
   */
  async initialize() {
    try {
      console.log('Initializing Pub/Sub service...');
      
      // Create topics if they don't exist
      await Promise.all(Object.values(TOPICS).map(async (topicName) => {
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
      }));
      
      // Create subscriptions if they don't exist
      const subscriptionPromises = [
        this.createSubscriptionIfNotExists(TOPICS.EMERGENCY_ALERTS, SUBSCRIPTIONS.EMERGENCY_ALERTS_SUB),
        this.createSubscriptionIfNotExists(TOPICS.DISASTER_WARNINGS, SUBSCRIPTIONS.DISASTER_WARNINGS_SUB),
        this.createSubscriptionIfNotExists(TOPICS.EVACUATION_NOTICES, SUBSCRIPTIONS.EVACUATION_NOTICES_SUB),
        this.createSubscriptionIfNotExists(TOPICS.SYSTEM_NOTIFICATIONS, SUBSCRIPTIONS.SYSTEM_NOTIFICATIONS_SUB)
      ];
      
      await Promise.all(subscriptionPromises);
      console.log('Pub/Sub service initialized successfully.');
    } catch (error) {
      console.error('Error initializing Pub/Sub service:', error);
    }
  },
  
  /**
   * Create a subscription if it doesn't exist
   * @param {string} topicName - Name of the topic
   * @param {string} subscriptionName - Name of the subscription
   */
  async createSubscriptionIfNotExists(topicName, subscriptionName) {
    try {
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
        console.log(`Subscription ${subscriptionName} created.`);
      } else {
        console.log(`Subscription ${subscriptionName} already exists.`);
      }
    } catch (error) {
      console.error(`Error creating subscription ${subscriptionName}:`, error);
    }
  },
  
  /**
   * Publish a message to a topic
   * @param {string} topicName - Name of the topic
   * @param {Object} data - Message data
   * @param {Object} attributes - Message attributes
   * @returns {string} Message ID
   */
  async publishMessage(topicName, data, attributes = {}) {
    try {
      // Validate topic name
      if (!Object.values(TOPICS).includes(topicName)) {
        throw new Error(`Invalid topic name: ${topicName}`);
      }
      
      const topic = pubsub.topic(topicName);
      
      // Convert data to string first, then to Buffer
      let dataBuffer;
      if (typeof data === 'string') {
        dataBuffer = Buffer.from(data);
      } else {
        dataBuffer = Buffer.from(JSON.stringify(data));
      }
      
      // Prepare message
      const messageObject = {
        data: dataBuffer,
        attributes: {
          timestamp: new Date().toISOString(),
          ...attributes
        }
      };
      
      // Publish message
      const messageId = await topic.publish(messageObject);
      console.log(`Message ${messageId} published to ${topicName}`);
      
      return messageId;
    } catch (error) {
      console.error(`Error publishing message to ${topicName}:`, error);
      throw error;
    }
  },
  
  /**
   * Subscribe to a topic and process messages
   * @param {string} subscriptionName - Name of the subscription
   * @param {function} messageHandler - Function to handle messages
   */
  subscribeToTopic(subscriptionName, messageHandler) {
    try {
      // Validate subscription name
      if (!Object.values(SUBSCRIPTIONS).includes(subscriptionName)) {
        throw new Error(`Invalid subscription name: ${subscriptionName}`);
      }
      
      const subscription = pubsub.subscription(subscriptionName);
      
      // Listen for messages
      subscription.on('message', (message) => {
        console.log(`Received message ${message.id} from ${subscriptionName}`);
        console.log(`Message attributes:`, message.attributes);
        
        try {
          // Parse message data
          const data = JSON.parse(message.data.toString());
          console.log(`Message data:`, JSON.stringify(data).substring(0, 200) + '...');
          
          // Process message
          messageHandler(data, message.attributes);
          
          // Acknowledge message
          message.ack();
          console.log(`Message ${message.id} acknowledged`);
        } catch (error) {
          console.error(`Error processing message ${message.id}:`, error);
          // Negative acknowledge message to retry
          message.nack();
        }
      });
      
      subscription.on('error', (error) => {
        console.error(`Subscription ${subscriptionName} error:`, error);
      });
      
      console.log(`Subscribed to ${subscriptionName}`);
    } catch (error) {
      console.error(`Error subscribing to ${subscriptionName}:`, error);
    }
  },
  
  /**
   * Get topic and subscription names
   */
  getTopics() {
    return TOPICS;
  },
  
  getSubscriptions() {
    return SUBSCRIPTIONS;
  }
};

module.exports = pubSubService; 