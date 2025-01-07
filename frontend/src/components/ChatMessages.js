import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

/**
 * ✅ ChatMessages Component - Clean, Minimal, and Responsive
 */
const ChatMessages = ({ messages, isTyping }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /**
   * ✅ Format Timestamp for Better Readability
   */
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-primary text-textPrimary">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex w-full  border-b border-secondary ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {/* ✅ Chat Bubble Styling */}
          <div
            className={`p-2 rounded-lg text-sm break-words leading-relaxed max-w-[70%] ${
              msg.role === "user"
                ? " text-white rounded-br-none"
                : " text-textPrimary bg-secondary overflow-scroll rounded-bl-none"
            }`}
          >
            {/* ✅ Render Markdown Properly with Code Styling */}
            <ReactMarkdown
              children={msg.message}
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");

                  // ✅ Prevent Overflow and Fix Code Wrapping
                  return !inline && match ? (
                    <div
                    className="max-w-7xl "
                      style={{
                        overflowX: "auto", // Enable horizontal scroll if needed
                        maxWidth: "100%",   // Prevent overflowing from the bubble
                        whiteSpace: "pre-wrap", // Break long lines properly
                        wordWrap: "break-word", // Prevent content from going outside
                      }}
                    >
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).trim()}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code
                      className="bg-primary border border-gray-700 block whitespace-pre-wrap break-words overflow-auto max-w-full py-2 px-4 rounded-lg text-xs"
                    >
                      {children}
                    </code>
                  );
                },
                a: ({ node, ...props }) => (
                  <a className="text-accent underline break-words" {...props}>
                    {props.children}
                  </a>
                ),
                p: ({ children }) => (
                  <p className="text-sm text-gray-100 mb-2 font-light break-words">
                    {children}
                  </p>
                ),
                h3: ({ children }) => (
                  <p className="text-lg text-gray-100 font-medium mt-4 mb-1 break-words">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <span className="text-gray-100 font-semibold break-words">
                    {children}
                  </span>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 break-words">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="list-item break-words">{children}</li>
                ),
              }}
            />
            {/* ✅ Timestamp Display */}
            <div className="text-xs text-gray-600 text-right">
              {formatTimestamp(msg.timestamp)}
            </div>
          </div>
        </div>
      ))}

      {/* ✅ Typing Indicator */}
      {isTyping && (
        <div className="flex items-center space-x-2 animate-pulse">
          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full delay-150"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full delay-300"></span>
        </div>
      )}

      {/* ✅ Auto-scroll anchor */}
      <div ref={chatEndRef}></div>
    </div>
  );
};

export default ChatMessages;
