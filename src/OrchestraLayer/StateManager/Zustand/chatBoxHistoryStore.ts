import { getEnv } from "@/OrchestraLayer/Utilities/envUtils";
import axios from "axios";
import { create } from "zustand";

interface ChatType {
    index: number;
    question: string;
    answer: string;
    timestamp: number;
}

interface ChatBoxHistoryStore {
    chatHistory: ChatType[];
    isTyping: boolean;
    putQuestion: (question: string) => void;
    getAnswer: () => string;
    addChat: (chat: ChatType) => void;
    fetchAnswer: (question: string) => Promise<void>;
    clearChat: () => void;
}

const useChatBoxHistoryStore = create<ChatBoxHistoryStore>((set, get) => ({
    chatHistory: [
        {
            index: 0,
            question: "",
            answer: "Hi, how can I help you today?",
            timestamp: Date.now(),
        }
    ],
    isTyping: false,
    putQuestion: (question: string) => set((state) => ({
        chatHistory: [...state.chatHistory, { index: state.chatHistory.length, question, answer: "...", timestamp: Date.now() }],
    })),
    getAnswer: () => {
        const history = get().chatHistory;
        return history.length > 0 ? history[history.length - 1].answer : "";
    },
    fetchAnswer: async (question: string) => {
        set({ isTyping: true });
        const apiKey = getEnv('VITE_GROQ_API_KEY');
        // Add the question to history immediately with a placeholder answer
        set((state) => ({
            chatHistory: [...state.chatHistory, {
                index: state.chatHistory.length,
                question,
                answer: "Thinking...",
                timestamp: Date.now()
            }]
        }));

        try {
            const response = await axios.post(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    messages: [
                        {
                            role: "user",
                            content: question
                        }
                    ],
                    model: "openai/gpt-oss-120b",
                    temperature: 0.7,
                    max_tokens: 1024,
                    top_p: 1,
                    stream: false,
                },
                {
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const answer = response.data.choices[0]?.message?.content || "No response received.";

            // Update the last entry with the real answer
            set((state) => {
                const newHistory = [...state.chatHistory];
                if (newHistory.length > 0) {
                    newHistory[newHistory.length - 1].answer = answer;
                }
                return { chatHistory: newHistory, isTyping: false };
            });
        } catch (error: any) {
            console.error("Groq API Error:", error.response?.data || error.message);
            set((state) => {
                const newHistory = [...state.chatHistory];
                if (newHistory.length > 0) {
                    newHistory[newHistory.length - 1].answer = "Error: " + (error.response?.data?.error?.message || "Failed to fetch response.");
                }
                return { chatHistory: newHistory, isTyping: false };
            });
        }
    },
    addChat: (chat: ChatType) => set((state) => ({
        chatHistory: [...state.chatHistory, chat],
    })),
    clearChat: () => set((state) => ({
        chatHistory: [],
    })),
}));

export { useChatBoxHistoryStore };
export type { ChatBoxHistoryStore, ChatType };
