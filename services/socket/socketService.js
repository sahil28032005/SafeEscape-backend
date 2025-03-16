const socketIO = require('socket.io');
const pubSubService = require('../pubsub/pubSubService');


/**
 * Socket.IO service for real-time communication
 */
const socketService = {
  io: null,
  
  /**
   * Initialize Socket.IO server
   * @param {Object} server - HTTP server
   */
  initialize(server) {
    this.io = socketIO(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
    
    console.log('Socket.IO initialized');
    
    // Set up connection handler
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      
      // Handle user registration
      socket.on('register', (userData) => {
        this.registerUser(socket, userData);
      });
      
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
    
    // Subscribe to Pub/Sub topics
    this.setupPubSubSubscriptions();
  },
  
  /**
   * Register a user for real-time updates
   * @param {Object} socket - Socket.IO socket
   * @param {Object} userData - User data
   */
  registerUser(socket, userData) {
    try {
      console.log(`Registering user: ${userData.userId}`);
      
      // Store user data in socket
      socket.userData = userData;
      
      // Join user-specific room
      socket.join(`user-${userData.userId}`);
      
      // Join location-based rooms
      if (userData.location) {
        const city = userData.location.city?.toLowerCase();
        const state = userData.location.state?.toLowerCase();
        
        if (city) {
          socket.join(`city-${city}`);
          console.log(`User joined room: city-${city}`);
        }
        if (state) {
          socket.join(`state-${state}`);
          console.log(`User joined room: state-${state}`);
        }
        
        // Join country room
        socket.join('country-india');
        console.log(`User joined room: country-india`);
      }
      
      // Confirm registration
      socket.emit('registered', {
        success: true,
        message: 'Successfully registered for real-time updates'
      });
    } catch (error) {
      console.error('Error registering user:', error);
      socket.emit('registered', {
        success: false,
        message: 'Failed to register for real-time updates'
      });
    }
  },
  
  /**
   * Set up Pub/Sub subscriptions
   */
  setupPubSubSubscriptions() {
    const subscriptions = pubSubService.getSubscriptions();
    
    // Subscribe to emergency alerts
    pubSubService.subscribeToTopic(
      subscriptions.EMERGENCY_ALERTS_SUB,
      (data, attributes) => this.handleEmergencyAlert(data, attributes)
    );
    
    // Subscribe to disaster warnings
    pubSubService.subscribeToTopic(
      subscriptions.DISASTER_WARNINGS_SUB,
      (data, attributes) => this.handleDisasterWarning(data, attributes)
    );
    
    // Subscribe to evacuation notices
    pubSubService.subscribeToTopic(
      subscriptions.EVACUATION_NOTICES_SUB,
      (data, attributes) => this.handleEvacuationNotice(data, attributes)
    );
    
    // Subscribe to system notifications
    pubSubService.subscribeToTopic(
      subscriptions.SYSTEM_NOTIFICATIONS_SUB,
      (data, attributes) => this.handleSystemNotification(data, attributes)
    );
  },
  
  /**
   * Handle emergency alert
   * @param {Object} data - Alert data
   * @param {Object} attributes - Message attributes
   */
  handleEmergencyAlert(data, attributes) {
    console.log('Received emergency alert:', data.id || 'unknown');
    console.log('Alert data:', JSON.stringify(data));
    console.log('Alert attributes:', JSON.stringify(attributes));
    
    // Broadcast to all clients for testing
    this.io.emit('emergency-alert', {
      alert: data,
      attributes: attributes
    });
    
    // Determine target rooms based on location
    if (data.location) {
      const targetRooms = this.getTargetRooms(data.location, attributes.region);
      console.log('Broadcasting to rooms:', targetRooms);
      
      // Broadcast to target rooms
      targetRooms.forEach(room => {
        this.io.to(room).emit('emergency-alert', {
          alert: data,
          attributes: attributes
        });
      });
    }
    
    // Broadcast to all clients for critical alerts
    if (attributes.severity === 'critical') {
      this.io.emit('critical-alert', {
        alert: data,
        attributes: attributes
      });
    }
  },
  
  /**
   * Handle disaster warning
   * @param {Object} data - Warning data
   * @param {Object} attributes - Message attributes
   */
  handleDisasterWarning(data, attributes) {
    console.log('Received disaster warning:', data.id || 'unknown');
    
    // Broadcast to all clients for testing
    this.io.emit('disaster-warning', {
      warning: data,
      attributes: attributes
    });
    
    // Determine target rooms based on location
    if (data.location) {
      const targetRooms = this.getTargetRooms(data.location, attributes.region);
      
      // Broadcast to target rooms
      targetRooms.forEach(room => {
        this.io.to(room).emit('disaster-warning', {
          warning: data,
          attributes: attributes
        });
      });
    }
  },
  
  /**
   * Handle evacuation notice
   * @param {Object} data - Notice data
   * @param {Object} attributes - Message attributes
   */
  handleEvacuationNotice(data, attributes) {
    console.log('Received evacuation notice:', data.id || 'unknown');
    
    // Broadcast to all clients for testing
    this.io.emit('evacuation-notice', {
      notice: data,
      attributes: attributes
    });
    
    // Determine target rooms based on location
    if (data.area) {
      const targetRooms = this.getTargetRooms(data.area, attributes.region);
      
      // Broadcast to target rooms
      targetRooms.forEach(room => {
        this.io.to(room).emit('evacuation-notice', {
          notice: data,
          attributes: attributes
        });
      });
    }
    
    // Broadcast to all clients for critical evacuations
    if (attributes.severity === 'critical') {
      this.io.emit('critical-evacuation', {
        notice: data,
        attributes: attributes
      });
    }
  },
  
  /**
   * Handle system notification
   * @param {Object} data - Notification data
   * @param {Object} attributes - Message attributes
   */
  handleSystemNotification(data, attributes) {
    console.log('Received system notification:', data.id || 'unknown');
    
    // Broadcast to all clients
    this.io.emit('system-notification', {
      notification: data,
      attributes: attributes
    });
  },
  
  /**
   * Get target rooms based on location
   * @param {Object} location - Location data
   * @param {string} region - Region string
   * @returns {Array} List of room names
   */
  getTargetRooms(location, region) {
    const rooms = [];
    
    // Add country room
    rooms.push('country-india');
    
    // Add state room if available
    if (location && location.state) {
      rooms.push(`state-${location.state.toLowerCase()}`);
    }
    
    // Add city room if available
    if (location && location.city) {
      rooms.push(`city-${location.city.toLowerCase()}`);
    }
    
    // Add region room if specified
    if (region && region !== 'all') {
      const regionParts = region.split(',');
      if (regionParts.length > 0) {
        rooms.push(`city-${regionParts[0].toLowerCase()}`);
      }
      if (regionParts.length > 1) {
        rooms.push(`state-${regionParts[1].toLowerCase()}`);
      }
    }
    
    return rooms;
  },
  
  /**
   * Send a direct message to a specific user
   * @param {string} userId - User ID
   * @param {string} event - Event name
   * @param {Object} data - Message data
   */
  sendToUser(userId, event, data) {
    this.io.to(`user-${userId}`).emit(event, data);
  },
  
  /**
   * Broadcast a message to all connected clients
   * @param {string} event - Event name
   * @param {Object} data - Message data
   */
  broadcast(event, data) {
    this.io.emit(event, data);
  }
};


module.exports = socketService; 