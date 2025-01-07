import axios from "axios";
import { auth } from "./firebase"; // ✅ Correct Import

const BASE_URL = "https://3e63-2401-4900-881a-1d05-f005-506d-ef1a-a90a.ngrok-free.app/api/v1"


/**
 * ✅ Fetch Firebase Token Securely
 */
const getToken = async () => {
    const user = localStorage.getItem("user") ?  JSON.parse(localStorage.getItem("user")) : null;  // Access the current user directly

    
    if (user) {
        const token =  user.idToken; // ✅ Force refresh token to avoid expiration issues true
        return token;
    } else {
        throw new Error("User not authenticated.");
    }
};

/**
 * ✅ Send Message to Server with Firebase Token
 */
export const sendMessageToChatbot = async (message, chatId,updatedHistory) => {
    try {
        const token = await getToken();
        const response = await axios.post(`${BASE_URL}/chat/sendMessage`, 
            { chatId, message,history:updatedHistory },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data.response;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

/**
 * ✅ Create a New Chat
 */
export const createNewChat = async () => {
    try {
        const token = await getToken();
        const response = await axios.post(`${BASE_URL}/chat/create`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.chatId;
    } catch (error) {
        console.error("Error creating a new chat:", error);
        throw error;
    }
};

/**
 * ✅ Fetch All User Chats
 */
export const fetchUserChats = async () => {
    try {
        const token = await getToken();
        const response = await axios.get(`${BASE_URL}/chat/getChats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user chats:", error);
        throw error;
    }
};

/**
 * ✅ Fetch All Messages for a Specific Chat ID
 */
export const fetchChatMessages = async (chatId) => {
    try {
        const token = await getToken();
        console.log(token);
        
        const response = await axios.get(`${BASE_URL}/chat/getChats/${chatId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching chat messages:", error);
        throw error;
    }
};

/**
 * ✅ Delete Chat
 */
export const deleteChat = async (chatId) => {
    const token = await getToken();
    await axios.delete(`${BASE_URL}/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};