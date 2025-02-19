const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Register user
router.post('/register', userController.register);

// Update user profile
router.put('/:id', userController.updateProfile);

// Add FCM token
router.post('/:id/fcm', userController.addFcmToken);

// Remove FCM token
router.delete('/:id/fcm', userController.removeFcmToken);

// Get user by ID
router.get('/:id', userController.getUserById);

module.exports = router;
