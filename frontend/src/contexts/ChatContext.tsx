import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
    updatedAt: number;
}

interface ChatContextType {
    conversations: Conversation[];
    currentConversationId: string;
    messages: Message[];
    addMessage: (message: Message) => void;
    createNewConversation: () => void;
    switchConversation: (id: string) => void;
    deleteConversation: (id: string) => void;
    renameConversation: (id: string, title: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STORAGE_KEY = 'edugen_conversations';
const DEFAULT_MESSAGE: Message = {
    role: 'assistant',
    content: 'Hello! I am EduGen AI. How can I assist you with your academic tasks today?'
};

const generateId = () => `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const generateTitle = (messages: Message[]): string => {
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (firstUserMessage) {
        const preview = firstUserMessage.content.slice(0, 30);
        return preview.length < firstUserMessage.content.length ? `${preview}...` : preview;
    }
    return 'New Chat';
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [conversations, setConversations] = useState<Conversation[]>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return parsed.length > 0 ? parsed : [{
                    id: generateId(),
                    title: 'New Chat',
                    messages: [DEFAULT_MESSAGE],
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                }];
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
        return [{
            id: generateId(),
            title: 'New Chat',
            messages: [DEFAULT_MESSAGE],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }];
    });

    const [currentConversationId, setCurrentConversationId] = useState<string>(() => {
        return conversations[0]?.id || generateId();
    });

    // Save conversations to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
        } catch (error) {
            console.error('Error saving conversations:', error);
        }
    }, [conversations]);

    const currentConversation = conversations.find(c => c.id === currentConversationId);
    const messages = currentConversation?.messages || [DEFAULT_MESSAGE];

    const addMessage = (message: Message) => {
        setConversations(prev => prev.map(conv => {
            if (conv.id === currentConversationId) {
                const updatedMessages = [...conv.messages, message];
                return {
                    ...conv,
                    messages: updatedMessages,
                    title: conv.title === 'New Chat' ? generateTitle(updatedMessages) : conv.title,
                    updatedAt: Date.now(),
                };
            }
            return conv;
        }));
    };

    const createNewConversation = () => {
        const newConv: Conversation = {
            id: generateId(),
            title: 'New Chat',
            messages: [DEFAULT_MESSAGE],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        setConversations(prev => [newConv, ...prev]);
        setCurrentConversationId(newConv.id);
    };

    const switchConversation = (id: string) => {
        setCurrentConversationId(id);
    };

    const deleteConversation = (id: string) => {
        setConversations(prev => {
            const filtered = prev.filter(c => c.id !== id);
            if (filtered.length === 0) {
                const newConv: Conversation = {
                    id: generateId(),
                    title: 'New Chat',
                    messages: [DEFAULT_MESSAGE],
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                };
                setCurrentConversationId(newConv.id);
                return [newConv];
            }
            if (id === currentConversationId) {
                setCurrentConversationId(filtered[0].id);
            }
            return filtered;
        });
    };

    const renameConversation = (id: string, title: string) => {
        setConversations(prev => prev.map(conv =>
            conv.id === id ? { ...conv, title, updatedAt: Date.now() } : conv
        ));
    };

    return (
        <ChatContext.Provider value={{
            conversations,
            currentConversationId,
            messages,
            addMessage,
            createNewConversation,
            switchConversation,
            deleteConversation,
            renameConversation,
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};
