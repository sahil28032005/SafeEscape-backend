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

// Get user by ID (including emergency contacts)
router.get('/:id', userController.getUserById);

// Add emergency contact
router.post('/:id/emergency-contact', userController.addEmergencyContact);

// Update emergency contact (by phone number)
router.put('/:id/emergency-contact/:phone', userController.updateEmergencyContact);

// Delete emergency contact (by phone number)
router.delete('/:id/emergency-contact/:phone', userController.removeEmergencyContact);

module.exports = router;
