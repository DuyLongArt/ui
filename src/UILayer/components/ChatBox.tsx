import { useChatBoxHistoryStore } from "@/OrchestraLayer/StateManager/Zustand/chatBoxHistoryStore";
import React, { useState, useRef, useEffect } from "react";
import LiquidGlassCard from "./LiquidGlassCard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatBox: React.FC = () => {
    const [message, setMessage] = useState("");
    const chatBoxHistoryStore = useChatBoxHistoryStore();

    // 1. Create a ref for the scrollable container
    const scrollRef = useRef<HTMLDivElement>(null);

    // 2. Use useEffect to scroll to the bottom when history changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatBoxHistoryStore.chatHistory]); // Trigger on history updates

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Display Area - Added ref here */}
            {/* <div className="border-b w-110! border-black font-bold bg-indigo-700! text-white! sticky top-0 backdrop-blur-md p-2 z-10">
                Chat Box
            </div> */}
            <div
                // ref={scrollRef}
                className="w-110! overflow-y-scroll rounded-md bg-indigo-700/30 backdrop-blur-sm  border-none!  h-75 shadow-lg  no-scrollbar"
            >

                <div className="p-2 text-sm text-gray-800">
                    {[...chatBoxHistoryStore.chatHistory].reverse().map((chat) => (
                        <div className="mb-6 flex flex-col gap-2" key={chat.index}>
                            {chat.question && (
                                <div className="self-end bg-indigo-100 p-2 max-w-[90%] text-indigo-900 border border-indigo-200">
                                    <div className="font-bold text-[10px] uppercase opacity-50 mb-1">You</div>
                                    <div>{chat.question}</div>
                                </div>
                            )}
                            <div className="self-start bg-white/50 p-2 max-w-[95%] border border-gray-200 shadow-sm backdrop-blur-sm">
                                <div className="font-bold text-[10px] uppercase opacity-50 mb-1 text-indigo-600">AI</div>
                                <div className="prose prose-sm max-w-none prose-indigo markdown-content">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {chat.answer}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="w-110! bg-indigo-950 rounded-b-lg shadow-lg p-2">
                <input
                    type="text"
                    value={message}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="w-full p-2  bg-white text-black outline-none"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && message.trim()) {
                            chatBoxHistoryStore.fetchAnswer(message);
                            setMessage("");
                        }
                    }}
                />
            </div>

            <style>{`
                .markdown-content {
                width: 100%;
                }
                .markdown-content table {
                width: 100%;
                }
                .markdown-content p { margin-bottom: 0.5rem; }
                .markdown-content p:last-child { margin-bottom: 0; }
                .markdown-content ul, .markdown-content ol { padding-left: 1.25rem; margin-bottom: 0.5rem; }
                .markdown-content li { margin-bottom: 0.25rem; }
                .markdown-content code {width: 100%; background: rgba(0,0,0,0.05); padding: 0.1rem 0.3rem; border-radius: 4px; font-family: monospace; }
                .markdown-content pre { background: #1e1e1e; color: #d4d4d4; padding: 0.75rem; border-radius: 8px; overflow-x: auto; margin: 0.5rem 0; }
                .markdown-content pre code { background: transparent; padding: 0; }
                .markdown-content strong { font-weight: 700; color: #1a1a1a; }
                .markdown-content h1, .markdown-content h2, .markdown-content h3 { font-weight: 700; margin: 0.75rem 0 0.5rem 0; }
            `}</style>
        </div>
    );
};

export { ChatBox };