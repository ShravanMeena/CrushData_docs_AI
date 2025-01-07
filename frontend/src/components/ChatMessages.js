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
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-600 py-1 px-4 rounded-lg text-xs">
                      {children}
                    </code>
                  );
                },
                a: ({ node, ...props }) => (
                  <a className="text-accent underline" {...props}>
                    {props.children}
                  </a>
                ),
                p: ({ children }) => (
                  <p className="text-sm mb-2 text-gray-100  font-light ">
                    {children}
                  </p>
                ),
                h3: ({ children }) => (
                  <p className="text-gray-100  mt-4 mb-1 font-medium text-lg ">
                    {children}
                  </p>
                ),
                h6: ({ children }) => (
                    <p className="text-accent  text-lg ">
                      {children}
                    </p>
                  ),
                strong: ({ children }) => (
                  <span className="text-gray-100  font-medium  mb-2 ml-4 py-2 text-sm">
                    {children}
                  </span>
                ),
                ul: ({ children }) => (
                  <ul className="pl-6 ">{children}</ul>
                ),
                li: ({ children }) => <li className="list-decimal mt-2">{children}</li>,
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
