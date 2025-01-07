import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import { sendMessageToChatbot, fetchChatMessages, createNewChat } from "../services/chatService";
import { useParams } from "react-router-dom";

const ChatPage = () => {
    const [chatHistory, setChatHistory] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const chatEndRef = useRef(null);
    const { chatId } = useParams();

    /**
     * ✅ Fetch chat messages on chatId change
     */
    const loadChatMessages = async () => {
        try {
            const messages = await fetchChatMessages(chatId);
            setChatHistory(messages);
            setLoading(false)
        } catch (error) {
            console.error("Error fetching chat messages:", error);
            setLoading(false)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (chatId) {
            loadChatMessages();
        }else{
            setLoading(false)
        }
    }, [chatId]);

    /**
     * ✅ Auto-scroll to the bottom when messages update
     */
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, isTyping]);

    /**
     * ✅ Handle Sending Messages
     */
    const handleSendMessage = async (newMessage) => {
        if (!newMessage.trim()) return;
        const updatedHistory = [
            ...chatHistory,
            {
                message: newMessage,
                role: "user",
                timestamp: new Date().toISOString(),
            },
        ];
        setChatHistory(updatedHistory);
        setIsTyping(true);

        try {
            await sendMessageToChatbot(newMessage, chatId, updatedHistory);
            loadChatMessages(); // Refresh messages after sending
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsTyping(false);
        }
    };

       // ✅ Create a New Chat and Redirect
        const handleNewChat = async () => {
            try {
                const newChatId = await createNewChat();
                window.location.href = `/chat/${newChatId}`;
            } catch (error) {
                console.error("Error creating new chat:", error);
            }
        };

    return (
        <div className="flex h-screen bg-primary text-textPrimary overflow-hidden">
            {/* ✅ Sidebar Component */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* ✅ Main Chat Section with Loading State */}
            <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? "pl-64" : "pl-20"}`}>
                {/* ✅ Loading State */}
                {loading ? (
                    <div className="flex-1 flex items-center justify-center text-sm font-semibold text-gray-400">
                        Loading messages...
                    </div>
                ) : chatHistory.length === 0 ? (
                    // ✅ Show this message when no chat history is available
                    <div className="flex-1 flex items-center justify-center text-sm font-semibold text-gray-400">
                        {chatId ? "Start a conversation! Ask something interesting ✨": <span className="cursor-pointer block hover:text-accent" onClick={handleNewChat}>Start A New Chat ✨</span>}
                    </div>
                ) : (
                    // ✅ Render Messages when available
                    <ChatMessages messages={chatHistory} isTyping={isTyping} />
                )}

                {/* ✅ Chat Input Bar */}
               {chatId && <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />}
                <div ref={chatEndRef}></div>
            </div>
        </div>
    );
};

export default ChatPage;