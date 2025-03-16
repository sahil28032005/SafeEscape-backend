require('dotenv').config();
const { PubSub } = require('@google-cloud/pubsub');

async function testPubSubConnection() {
  try {
    console.log('Testing Pub/Sub connection...');
    console.log('Project ID:', process.env.GOOGLE_CLOUD_PROJECT_ID);
    console.log('Credentials path:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
    
    // Initialize the client
    const pubsub = new PubSub({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
    
    // List all topics to test connection
    const [topics] = await pubsub.getTopics();
    
    console.log('\nExisting topics:');
    if (topics.length === 0) {
      console.log('No topics found. Creating a test topic...');
      
      // Create a test topic
      const topicName = 'test-topic';
      const [topic] = await pubsub.createTopic(topicName);
      console.log(`Topic ${topic.name} created.`);
      
      // Create a test subscription
      const subscriptionName = 'test-subscription';
      const [subscription] = await topic.createSubscription(subscriptionName);
      console.log(`Subscription ${subscription.name} created.`);
      
      // Publish a test message
      const messageId = await topic.publish(Buffer.from('Test message'));
      console.log(`Message ${messageId} published.`);
    } else {
      topics.forEach(topic => {
        console.log(`- ${topic.name}`);
      });
    }
    
    console.log('\n✅ Pub/Sub connection successful!');
  } catch (error) {
    console.error('\n❌ Pub/Sub connection failed:', error);
    
    if (error.code === 7) {
      console.log('\nPermission denied error. Check that:');
      console.log('1. The Pub/Sub API is enabled in your project');
      console.log('2. Your service account has the necessary Pub/Sub permissions');
      console.log('3. Your credentials file is valid and accessible');
    }
    
    if (error.code === 16) {
      console.log('\nAuthentication error. Check that:');
      console.log('1. Your GOOGLE_APPLICATION_CREDENTIALS path is correct');
      console.log('2. The service account key file exists and is valid');
      console.log('3. Your project ID is correct');
    }
  }
}

testPubSubConnection(); 