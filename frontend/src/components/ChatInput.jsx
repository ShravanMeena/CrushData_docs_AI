import React, { useState, useRef, useEffect } from "react";

const ChatInput = ({ onSendMessage, isTyping }) => {
    const [message, setMessage] = useState("");
    const chatEndRef = useRef(null);  // Ref for scrolling animation

    useEffect(() => {
        // Auto-scroll to bottom with smooth animation
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [isTyping]); 

    const handleSend = () => {
        if (!message.trim() || isTyping) return; 
        onSendMessage(message);
        setMessage("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-4 border-t border-border flex items-center gap-4 ">
            {/* Text Input */}
            <textarea
                className="flex-1 p-3 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-textPrimary bg-secondary resize-none"
                rows="2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message here..."
            />
            
            {/* Send Button */}
            <button
                onClick={handleSend}
                disabled={isTyping}
                className={`rounded-full text-white font-semibold transition-all duration-300 flex items-center justify-center shadow-md ${
                    isTyping
                        ? " cursor-not-allowed"
                        : "bg-secondary  transform hover:scale-105"
                }`}
            >
               <span className="flex items-center ">
                        {/* Send */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 10l11-7m0 0l11 7m-11-7v18"
                            />
                        </svg>
                    </span>
            </button>

            {/* Invisible scroll anchor for smooth scrolling */}
            <div ref={chatEndRef}></div>
        </div>
    );
};

export default ChatInput;