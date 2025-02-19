const admin = require('firebase-admin');
const serviceAccount = require('./firebase-serviceAccount.json');

// Initialize Firebase Admin with Firestore
const initializeFirebase = () => {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        const db = admin.firestore();

        // Optional: Configure Firestore settings
        db.settings({
            timestampsInSnapshots: true,
            ignoreUndefinedProperties: true
        });

        console.log('✅ Firebase initialized successfully');
        return { admin, db };
    } catch (error) {
        console.error('❌ Error initializing Firebase:', error);
        throw error;
    }
};

// Initialize Firebase and export instances
const { admin: firebaseAdmin, db: firestore } = initializeFirebase();

module.exports = {
    admin: firebaseAdmin,
    db: firestore,

    // Collection references
    collections: {
        users: firestore.collection('users'),
        emergencies: firestore.collection('emergencies'),
        routes: firestore.collection('evacuation-routes'),
        shelters: firestore.collection('shelters')
    },

    // Firestore field values
    fieldValues: {
        serverTimestamp: admin.firestore.FieldValue.serverTimestamp,
        delete: admin.firestore.FieldValue.delete,
        increment: admin.firestore.FieldValue.increment
    }
}; 