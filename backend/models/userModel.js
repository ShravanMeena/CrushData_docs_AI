const { doc, setDoc } = require('firebase/firestore');
const { db } = require('../config/firebaseConfig');

// ✅ Structure for storing user data in Firestore
const createUserDocument = async (userId, email) => {
    try {
        await setDoc(doc(db, "users", userId), {
            email,
            createdAt: new Date()
        });
    } catch (error) {
        console.error("Error creating user document:", error);
    }
};

module.exports = { createUserDocument };