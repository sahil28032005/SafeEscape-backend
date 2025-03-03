const { PubSub } = require('@google-cloud/pubsub');
const pubSubClient = new PubSub();

// Publish a message to a specific topic
async function publishMessage(topicName, data) {
    const dataBuffer = Buffer.from(JSON.stringify(data));

    try {
        const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
        console.log(`Message ${messageId} published to topic ${topicName}`);
        return messageId;
    } catch (error) {
        console.error('Error publishing message:', error);
        throw new Error('Failed to publish message');
    }
}

// Subscribe to a specific subscription
async function subscribeToMessages(subscriptionName, messageHandler) {
    const subscription = pubSubClient.subscription(subscriptionName);

    const messageHandlerWrapper = (message) => {
        messageHandler(message);
        message.ack(); // Acknowledge the message after processing
    };

    subscription.on('message', messageHandlerWrapper);
    console.log(`Listening for messages on subscription ${subscriptionName}`);
}

// Example message handler
const exampleMessageHandler = (message) => {
    const data = JSON.parse(message.data.toString());
    console.log('Received message:', data);
};

// Export the functions for use in other parts of the application
module.exports = {
    publishMessage,
    subscribeToMessages,
    exampleMessageHandler,
}; 