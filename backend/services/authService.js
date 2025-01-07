const axios = require('axios');
const { auth } = require('../config/firebaseConfig');  
const { createUserDocument } = require('../models/userModel');

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;  // Ensure this API key is in your .env file

/**
 * ✅ Register a New User with Firebase Admin SDK
 * Securely registers a user and returns both a custom token and an ID token.
 */
const registerUser = async (email, password) => {
    try {
        const userRecord = await auth.createUser({
            email: email,
            password: password,
        });

        // ✅ Store user details in Firestore
        await createUserDocument(userRecord.uid, email);

        // ✅ Generate a custom token for the new user
        const customToken = await auth.createCustomToken(userRecord.uid);

        // ✅ Exchange the custom token for an ID token using Firebase REST API
        const idTokenResponse = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${FIREBASE_API_KEY}`,
            {
                token: customToken,
                returnSecureToken: true
            }
        );

        const idToken = idTokenResponse.data.idToken;

        return { ...userRecord, customToken, idToken };
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error(`Failed to create user: ${error.message}`);
    }
};

/**
 * ✅ Login User using Firebase REST API and Generate Custom Token with ID Token
 * Authenticates the user and generates both a secure custom token and an ID token.
 */
const loginUser = async (email, password) => {
    try {
        // Authenticate the user using Firebase REST API
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
            {
                email,
                password,
                returnSecureToken: true
            }
        );

        // ✅ Extract the UID and ID token from the response
        const { localId, idToken } = response.data;

        // ✅ Generate a custom token using the UID
        const customToken = await auth.createCustomToken(localId);

        return { ...response.data, customToken, idToken };
    } catch (error) {
        console.error("Login error:", error.response?.data || error);
        throw new Error("Invalid credentials or user not found.");
    }
};

/**
 * ✅ Logout (Managed on the Client Side)
 */
const logoutUser = async () => {
    try {
        console.log("Logout managed on the client side by removing the token.");
    } catch (error) {
        console.error("Error during logout:", error);
        throw new Error("Logout error.");
    }
};

module.exports = { registerUser, loginUser, logoutUser };