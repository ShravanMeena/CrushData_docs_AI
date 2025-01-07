const { db } = require('../config/firebaseConfig');
const admin = require('firebase-admin');

/**
 * ✅ Create a New Chat (Firestore Admin SDK)
 * @param {string} userId - Firebase UID
 * @returns {Promise<string>} - New chat ID
 */
const createNewChat = async (userId) => {
    const newChatRef = db.collection("chats").doc(); // ✅ Correct usage in Admin SDK
    await newChatRef.set({
        userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        messages: []
    });
    return newChatRef.id;
};

/**
 * ✅ Save a Message to an Existing Chat (Fixed)
 * @param {string} chatId
 * @param {string} message
 * @param {string} role
 */
const saveChatMessage = async (chatId, message, role) => {
    const chatRef = db.collection("chats").doc(chatId);

    // ✅ Generate Timestamp Separately
    const timestamp = new Date().toISOString(); // Explicitly generating the timestamp

    await chatRef.update({
        messages: admin.firestore.FieldValue.arrayUnion({
            message,
            role,
            timestamp: timestamp  // ✅ Using generated timestamp instead of serverTimestamp()
        })
    });
};

/**
 * ✅ Fetch All Chats for a User
 * @param {string} userId
 * @returns {Promise<Array>}
 */
const getUserChats = async (userId) => {
    try {
        const snapshot = await db
            .collection("chats")
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc") // ✅ Firestore Admin SDK allows chaining like this
            .get();

        if (snapshot.empty) {
            return [];
        }

        // ✅ Return Chats with Chat ID Included
        return snapshot.docs.map(doc => ({
            chatId: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching user chats:", error);
        throw new Error("Failed to fetch user chats.");
    }
};
const getChatMessages = async (chatId) => {
    try {
        const chatRef = db.collection("chats").doc(chatId); 
        const docSnapshot = await chatRef.get();

        if (!docSnapshot.exists) {
            console.error("Chat not found with ID:", chatId);
            throw new Error("Chat not found");
        }

        const chatData = docSnapshot.data();
        return chatData.messages || []; 
    } catch (error) {
        console.error("Error fetching chat messages:", error);
        throw error;
    }
};

/**
 * ✅ Update Chat Title (Used When History Length < 3)
 */
const updateChatTitle = async (chatId, title) => {
    const chatRef = db.collection("chats").doc(chatId);
    await chatRef.update({ title });
};

/**
 * ✅ Delete a Chat and Its Messages
 * - Deletes both the chat document and its messages from Firestore.
 */
const deleteChatById = async (chatId) => {
    const chatRef = db.collection("chats").doc(chatId);

    const docSnapshot = await chatRef.get();
    if (!docSnapshot.exists) {
        throw new Error("Chat not found");
    }

    await chatRef.delete();  // ✅ Deletes the entire chat document including messages
};

module.exports = { createNewChat, saveChatMessage, getUserChats, getChatMessages ,updateChatTitle, deleteChatById};