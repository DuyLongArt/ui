import { useChatBoxHistoryStore } from "@/OrchestraLayer/StateManager/Zustand/chatBoxHistoryStore";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatBoxProps {
    onClose?: () => void;
    anchorPosition?: { x: number; y: number };
}

const ChatBox: React.FC<ChatBoxProps> = ({ onClose, anchorPosition }) => {
    const [message, setMessage] = useState("");
    const chatBoxHistoryStore = useChatBoxHistoryStore();
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatBoxHistoryStore.chatHistory]);

    // Auto-focus on mount
    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    return (
        <div className="fixed bottom-10 sm:bottom-4  md:right-2 md:left-2 sm:left-auto sm:right-4 flex flex-col items-center sm:items-end">
            {/* Display Area - Added ref here */}
            {/* <div className="border-b w-110! border-black font-bold bg-indigo-700! text-white! sticky top-0 backdrop-blur-md p-2 z-10">
                Chat Box
            </div> */}
            <div
                ref={scrollRef}
                className="w-full md:w-110 overflow-y-scroll rounded-t-xl bg-white/10 backdrop-blur-md border border-white/20 md:h-[450px] h-[350px] sm:h-75 shadow-2xl no-scrollbar flex flex-col"
            >
                <div className="sticky top-0 z-20 bg-indigo-700/80 backdrop-blur-md p-1 flex justify-between items-center text-white border-b border-white/10">
                    <div className="flex items-center gap-2 font-bold">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        AI Assistant
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onClose?.(); }}
                            className="text-xs font-semibold text-indigo-600 bg-white/50 hover:bg-white px-2.5 py-1 rounded-md transition-all border border-indigo-100"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {/* Messages Area - Glassy & Light */}
                <div
                    ref={scrollRef}
                    className="md:h-[550px]  h-[250px] sm:h-80 overflow-y-scroll p-4 space-y-4 bg-indigo-50/30 no-scrollbar"
                >
                    {chatBoxHistoryStore.chatHistory.map((chat) => (
                        <div className="flex flex-col gap-2" key={chat.index}>
                            {chat.question && (
                                <div className="self-end bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-md text-sm leading-relaxed">
                                    <div className="font-bold text-[10px] uppercase opacity-70 mb-1">You</div>
                                    <div>{chat.question}</div>
                                </div>
                            )}
                            <div className="self-start bg-white p-3 rounded-2xl rounded-tl-sm max-w-[90%] shadow-sm border border-indigo-50 text-sm">
                                <div className="font-bold text-[10px] uppercase text-indigo-500 mb-1">Kurisu</div>
                                <div className="prose prose-sm max-w-none text-slate-700 markdown-content">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {chat.answer}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}
                    {chatBoxHistoryStore.isTyping && (
                        <div className="self-start bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-indigo-50 w-20">
                            <div className="flex gap-1 justify-center">
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area - Dark & Contrast */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (message.trim()) {
                            chatBoxHistoryStore.fetchAnswer(message);
                            setMessage("");
                            // Re-focus input after sending for rapid fire chatting
                            setTimeout(() => inputRef.current?.focus(), 10);
                        }
                    }}
                    className="bg-[#2e2e48] p-3 border-t border-indigo-900/10"
                >
                    <div className="flex items-center gap-2 bg-[#3e3e5e] rounded-xl p-1 pr-1.5 border border-white/5 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
                        <input
                            ref={inputRef}
                            type="text"
                            inputMode="text"
                            enterKeyHint="send"
                            value={message}
                            onChange={handleInputChange}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent text-white placeholder-gray-400 text-[16px] px-3 py-2.5 outline-none min-w-0"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            disabled={!message.trim()}
                            className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all shadow-lg active:scale-95 shrink-0 flex items-center justify-center touch-manipulation"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .markdown-content { width: 100%; }
                .markdown-content p { margin-bottom: 0.5rem; }
                .markdown-content p:last-child { margin-bottom: 0; }
                .markdown-content pre { background: #f1f5f9; color: #334155; padding: 0.75rem; border-radius: 0.5rem; overflow-x: auto; margin: 0.5rem 0; font-size: 0.9em;}
                .markdown-content code { background: rgba(0,0,0,0.05); padding: 0.1rem 0.3rem; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
                .markdown-content pre code { background: transparent; padding: 0; }
            `}</style>
        </div>
    );


};

export { ChatBox };