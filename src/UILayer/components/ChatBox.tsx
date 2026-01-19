import { useChatBoxHistoryStore } from "@/OrchestraLayer/StateManager/Zustand/chatBoxHistoryStore";
import React, { useState, useRef, useEffect } from "react";
import LiquidGlassCard from "./LiquidGlassCard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatBoxProps {
    onClose?: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onClose }) => {
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
        <div className="fixed bottom-4 right-2 left-2 sm:left-auto sm:right-4 z-50 flex flex-col items-center sm:items-end">
            {/* Display Area - Added ref here */}
            {/* <div className="border-b w-110! border-black font-bold bg-indigo-700! text-white! sticky top-0 backdrop-blur-md p-2 z-10">
                Chat Box
            </div> */}
            <div
                ref={scrollRef}
                className="w-full sm:w-110 overflow-y-scroll rounded-t-xl bg-white/10 backdrop-blur-md border border-white/20 h-[50vh] sm:h-75 shadow-2xl no-scrollbar flex flex-col"
            >
                <div className="sticky top-0 z-20 bg-indigo-700/80 backdrop-blur-md p-3 flex justify-between items-center text-white border-b border-white/10">
                    <div className="flex items-center gap-2 font-bold">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        AI Assistant
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onClose?.()}
                            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors sm:hidden"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => chatBoxHistoryStore.clearChat()}
                            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                </div>

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
            <div className="w-full sm:w-110 bg-indigo-950/90 backdrop-blur-lg rounded-b-xl shadow-2xl p-3 border border-t-0 border-white/10">
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={handleInputChange}
                        placeholder="Type a message..."
                        className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && message.trim()) {
                                chatBoxHistoryStore.fetchAnswer(message);
                                setMessage("");
                            }
                        }}
                    />
                    <button
                        onClick={() => {
                            if (message.trim()) {
                                chatBoxHistoryStore.fetchAnswer(message);
                                setMessage("");
                            }
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-lg transition-colors shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                    </button>
                </div>
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