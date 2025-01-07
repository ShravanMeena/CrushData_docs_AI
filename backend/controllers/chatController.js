const { generateResponse, generateTitle } = require("../services/geminiService");
const { createNewChat, saveChatMessage, getUserChats, getChatMessages, updateChatTitle, deleteChatById } = require('../services/chatService');
const { auth } = require("../config/firebaseConfig");

/**
 * ✅ Verify Firebase Token Middleware (Server-side)
 * - Decodes the token from the `Authorization` header.
 * - Adds the verified user info to `req.user`.
 */
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1]; // ✅ Correct token extraction

    if (!token) {
        return res.status(401).json({ error: "Authorization token is missing." });
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken; // ✅ Store the full token data for reference
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

/**
 * ✅ Create New Chat (POST)
 * - Token is verified via middleware.
 * - User is identified through the token.
 */
const createChat = async (req, res) => {
    try {
        const userId = req.user.uid; // ✅ Using token data instead of client-passed data
        
        const chatId = await createNewChat(userId);

        res.status(201).json({ chatId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * ✅ Save a Message and Generate a Response (POST)
 * - Securely saves a message and generates a response.
 */
// Inside your controller:
const saveMessage = async (req, res) => {
    const { chatId, message, history } = req.body;
    const userId = req.user.uid;

    if (!chatId || !message) {
        return res.status(400).json({ error: "Chat ID and message are required." });
    }

    try {
        const response = await generateResponse(message, history);
        await saveChatMessage(chatId, message, "user");
        await saveChatMessage(chatId, response, "bot");

        // ✅ Generate a Title If It's a New Chat
        if (history.length < 3) {
            const title = await generateTitle(message, response);
            await updateChatTitle(chatId, title);
        }

        res.status(201).json({ response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/**
 * ✅ Fetch User Chats (GET)
 * - Fetches all chats linked to the authenticated user.
 */
const getChats = async (req, res) => {
    try {
        const userId = req.user.uid;
        
        const chats = await getUserChats(userId);
        
        res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ error: error.message });
    }
};


/**
 * ✅ Fetch All Messages for a Particular Chat ID (GET)
 * - Securely fetches all messages associated with the given chat ID.
 */
const getChatMessagesById = async (req, res) => {
    try {
        const { chatId } = req.params;

        if (!chatId) {
            return res.status(400).json({ error: "Chat ID is required." });
        }

        const messages = await getChatMessages(chatId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/**
 * ✅ Delete Chat by Chat ID (DELETE)
 * - Deletes the chat and its associated messages from Firestore.
 */
const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        if (!chatId) {
            return res.status(400).json({ error: "Chat ID is required." });
        }

        await deleteChatById(chatId);
        res.status(200).json({ message: "Chat deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = { createChat, saveMessage, getChats, verifyToken,getChatMessagesById,deleteChat };



