const userService = require('../services/userService');

const userController = {
    /**
     * Registers a new user
     * @route POST /api/users/register
     */
    async register(req, res) {
        try {
            const userId = await userService.registerUser(req.body);
            res.status(201).json({ message: 'User registered successfully', userId });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    /**
     * Updates user profile
     * @route PUT /api/users/:id
     */
    async updateProfile(req, res) {
        try {
            const userId = req.params.id;
            await userService.updateUserProfile(userId, req.body);
            res.status(200).json({ message: 'Profile updated successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    /**
     * Adds an FCM token for push notifications
     * @route POST /api/users/:id/fcm
     */
    async addFcmToken(req, res) {
        try {
            const userId = req.params.id;
            const { fcmToken } = req.body;
            await userService.addFcmToken(userId, fcmToken);
            res.status(200).json({ message: 'FCM token added successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    /**
     * Removes an FCM token
     * @route DELETE /api/users/:id/fcm
     */
    async removeFcmToken(req, res) {
        try {
            const userId = req.params.id;
            const { fcmToken } = req.body;
            await userService.removeFcmToken(userId, fcmToken);
            res.status(200).json({ message: 'FCM token removed successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    /**
     * Gets user by ID (including emergency contacts)
     * @route GET /api/users/:id
     */
    async getUserById(req, res) {
        try {
            const userId = req.params.id;
            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    /**
     * Adds an emergency contact to a user
     * @route POST /api/users/:id/emergency-contact
     */
    async addEmergencyContact(req, res) {
        try {
            const userId = req.params.id;
            const contact = req.body; // { name, phone, relationship, priority }
            await userService.addEmergencyContact(userId, contact);
            res.status(200).json({ message: 'Emergency contact added successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    /**
     * Updates an emergency contact for a user
     * @route PUT /api/users/:id/emergency-contact/:phone
     */
    async updateEmergencyContact(req, res) {
        try {
            const userId = req.params.id;
            const phone = req.params.phone; // Identifier for the contact
            const updates = req.body; // Fields to update (name, relationship, priority)
            await userService.updateEmergencyContact(userId, phone, updates);
            res.status(200).json({ message: 'Emergency contact updated successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    /**
     * Removes an emergency contact from a user
     * @route DELETE /api/users/:id/emergency-contact/:phone
     */
    async removeEmergencyContact(req, res) {
        try {
            const userId = req.params.id;
            const phone = req.params.phone; // Identifier for the contact
            await userService.removeEmergencyContact(userId, phone);
            res.status(200).json({ message: 'Emergency contact removed successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
};

module.exports = userController;
