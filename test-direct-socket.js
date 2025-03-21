require('dotenv').config();
const socketIO = require('socket.io-client');

// Connect to Socket.IO server
const socket = socketIO('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to server');
  
  // Register as a test user
  socket.emit('register', {
    userId: 'test-user',
    location: {
      city: 'Mumbai',
      state: 'Maharashtra'
    }
  });
  
  // Listen for registration confirmation
  socket.on('registered', (data) => {
    console.log('Registration response:', data);
    
    if (data.success) {
      console.log('Successfully registered');
    } else {
      console.log('Registration failed');
    }
  });
  
  // Listen for emergency alerts
  socket.on('emergency-alert', (data) => {
    console.log('Received emergency alert:', data.alert.title);
    console.log('Alert data:', data);
  });
  
  // Listen for other events
  socket.on('disaster-warning', (data) => {
    console.log('Received disaster warning:', data.warning.title);
  });
  
  socket.on('evacuation-notice', (data) => {
    console.log('Received evacuation notice:', data.notice.area?.name);
  });
  
  socket.on('system-notification', (data) => {
    console.log('Received system notification:', data.notification.title);
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
});

// Keep the script running
console.log('Listening for events from the server...'); 