const { io } = require('socket.io-client');

// Connect to your Socket.IO server with debug options
const socket = io('http://localhost:5000', {
  reconnectionAttempts: 5,
  timeout: 10000,
  transports: ['websocket', 'polling'],
  // Add debug option to see what's happening with the connection
  debug: true
});

// Handle connection events
socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
  
  // Wait a moment before sending the register event
  setTimeout(() => {
    // Send register event after connection
    const userData = {
      userId: 'test-user-123',
      location: {
        city: 'Mumbai',
        state: 'Maharashtra',
        coordinates: {
          latitude: 19.0760,
          longitude: 72.8777
        }
      }
    };
    
    console.log('Sending register event with data:', userData);
    
    // Use callback to confirm the event was received
    socket.emit('register', userData, (response) => {
      console.log('Received acknowledgment from server:', response);
    });
  }, 1000);
  
  // Set a timeout to check if we received a response
  setTimeout(() => {
    console.log('Checking if registration was confirmed...');
    
    // Try a simple event to test basic communication
    console.log('Sending ping event to test basic communication...');
    socket.emit('ping', { time: new Date().toISOString() });
    
    // Try sending the register event with a different format
    console.log('Trying alternative register format...');
    socket.emit('register', JSON.stringify({
      userId: 'test-user-456',
      location: {
        city: 'Delhi',
        state: 'Delhi',
        coordinates: {
          latitude: 28.7041,
          longitude: 77.1025
        }
      }
    }));
  }, 5000);
});

// Listen for welcome message
socket.on('welcome', (data) => {
  console.log('Received welcome message:', data);
});

// Listen for registered confirmation
socket.on('registered', (data) => {
  console.log('Received registration confirmation:', data);
});

// Listen for pong response
socket.on('pong', (data) => {
  console.log('Received pong response:', data);
});

// Listen for any event (debug)
socket.onAny((eventName, ...args) => {
  console.log(`Received event: ${eventName}`, JSON.stringify(args));
});

// Listen for connection errors
socket.on('connect_error', (error) => {
  console.log('Connection error:', error.message);
});

// Listen for disconnect
socket.on('disconnect', (reason) => {
  console.log('Disconnected from server. Reason:', reason);
});

// Listen for reconnect attempts
socket.io.on('reconnect_attempt', (attempt) => {
  console.log(`Reconnection attempt: ${attempt}`);
});

// Keep the script running
process.stdin.resume();
console.log('Test client running. Press Ctrl+C to exit.');