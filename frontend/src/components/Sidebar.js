import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createNewChat, fetchUserChats, deleteChat } from "../services/chatService";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { currentUser, handleLogout } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const { chatId: activeChatId } = useParams();

    // ✅ Create a New Chat and Redirect
    const handleNewChat = async () => {
        try {
            const newChatId = await createNewChat();
            window.location.href = `/chat/${newChatId}`;
        } catch (error) {
            console.error("Error creating new chat:", error);
        }
    };

    // ✅ Fetch User's Chats on Load
    useEffect(() => {
        const loadChats = async () => {
            setLoading(true);
            try {
                const userChats = await fetchUserChats();
                setChats(userChats);
            } catch (error) {
                console.error("Error fetching chats:", error);
            } finally {
                setLoading(false);
            }
        };
        loadChats();
    }, []);

    // ✅ Delete Chat Function
    const handleDeleteChat = async (chatId) => {
        try {
            await deleteChat(chatId);
            setChats(chats.filter(chat => chat.chatId !== chatId));
            window.location.href = `/`;
        } catch (error) {
            console.error("Error deleting chat:", error);
        }
    };

    return (
        <div
            className={`fixed top-0 left-0 h-full bg-secondary  border-r border-border  text-textPrimary transition-all duration-300 ease-in-out 
            ${isOpen ? "w-64" : "w-12"} flex flex-col`}
        >
            {/* ✅ Sidebar Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute top-4 right-4 text-gray-200 text-lg transform transition-transform duration-300"
            >
                {isOpen ? "←" : "→"}
            </button>

            {/* ✅ Sidebar Content */}
            {isOpen && (
                <>
                    {/* ✅ Header Section */}
                    <div className="p-4 flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-accent">✨Crus.doc✨</h1>
                    </div>

                    {/* ✅ New Chat Button */}
                    <button
                        onClick={handleNewChat}
                        className="mx-4 mb-6 p-2 border border-gray-600 text-sm text-gray-400  rounded-lg  transition duration-300 text-center"
                    >
                        + New Chat
                    </button>

                    {/* ✅ Chat List Section */}
                    <div className="flex-1 overflow-y-auto px-4 space-y-2">
                        {loading ? (
                            // ✅ Skeleton Loader
                            [...Array(4)].map((_, index) => (
                                <div key={index} className="h-10 w-full bg-gray-700 rounded-lg animate-pulse"></div>
                            ))
                        ) : (
                            chats.map((chat) => (
                                <div key={chat.chatId} className="flex text-xs items-center justify-between p-2 text-xsrounded-lg transition-all duration-300 
                                     cursor-pointer hover:text-accent">
                                    <Link
                                        to={`/chat/${chat.chatId}`}
                                        className={`flex-1  line-clamp-1  ${activeChatId === chat.chatId ? "text-accent" : ""}`}
                                    >
                                        {chat.title || "Untitled Chat"}
                                    </Link>
                                    {/* ✅ Delete Button */}
                                    <button
                                        onClick={() => handleDeleteChat(chat.chatId)}
                                        className="text-gray-600 font-bold text-xs ml-2"
                                    >
                                        X
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* ✅ User Info and Logout Section */}
                    <div className="p-4 border-t border-border mt-auto">
                        <p className="font-bold truncate text-sm pb-[2px]">{currentUser?.email}</p>
                        <button
                            onClick={handleLogout}
                            className="mt-3 w-full py-2 bg-gray-700 hover:bg-gray-700 text-white rounded-lg transition-all duration-300"
                        >
                            Logout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Sidebar;