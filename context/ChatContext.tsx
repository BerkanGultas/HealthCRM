
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Conversation, ChatMessage, MessagePlatform } from '../types';

// Mock data to initialize
const initialConversations: Conversation[] = [
  { id: 1, customerName: 'Alice Johnson', lastMessage: 'Okay, thank you for the information!', timestamp: '10:45 AM', platform: MessagePlatform.WhatsApp, avatarUrl: 'https://picsum.photos/id/11/200/200', unreadCount: 0 },
  { id: 2, customerName: 'Bob Williams', lastMessage: 'Can you send me the payment link?', timestamp: '10:42 AM', platform: MessagePlatform.Facebook, avatarUrl: 'https://picsum.photos/id/12/200/200', unreadCount: 2 },
  { id: 3, customerName: 'Charlie Brown', lastMessage: 'I have a question about the procedure.', timestamp: 'Yesterday', platform: MessagePlatform.Instagram, avatarUrl: 'https://picsum.photos/id/13/200/200', unreadCount: 0 },
  { id: 999, customerName: 'Web Chat Visitor', lastMessage: 'Hello! How can we help you?', timestamp: 'Yesterday', platform: MessagePlatform.WebChat, avatarUrl: 'https://picsum.photos/id/1005/200/200', unreadCount: 1 },
];

const initialMessages: Record<number, ChatMessage[]> = {
    1: [],
    2: [
        { id: 1, sender: 'user', text: 'Hello, I would like to get a quote for a hair transplant.', timestamp: '10:30 AM'},
        { id: 2, sender: 'agent', text: 'Of course! I can help with that. Could you please provide some photos?', timestamp: '10:31 AM', agentName: 'Admin User'},
        { id: 3, sender: 'user', text: 'Sure, here they are.', timestamp: '10:35 AM'},
        { id: 4, sender: 'agent', text: 'Thank you. Based on the photos, the estimated cost is $2500. This includes the procedure, hotel, and transfers.', timestamp: '10:40 AM', agentName: 'Admin User'},
        { id: 5, sender: 'user', text: 'That sounds great. How can I proceed with the payment?', timestamp: '10:41 AM'},
        { id: 6, sender: 'agent', text: 'I will generate a secure payment link for you now.', timestamp: '10:42 AM', agentName: 'Admin User'},
    ],
    3: [],
    999: [
      { id: 1, sender: 'user', text: 'Hello! How can we help you?', timestamp: 'Yesterday' }
    ],
};

const CHAT_STORAGE_KEY = 'healthcrm_chats';

interface ChatContextType {
  conversations: Conversation[];
  messages: Record<number, ChatMessage[]>;
  sendMessage: (conversationId: number, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

const loadStateFromStorage = () => {
    try {
        const storedState = localStorage.getItem(CHAT_STORAGE_KEY);
        if (storedState) {
            const parsedState = JSON.parse(storedState);
            // Ensure Web Chat conversation exists for filter
            if (!parsedState.conversations.some((c: Conversation) => c.platform === MessagePlatform.WebChat)) {
                parsedState.conversations.push(initialConversations.find(c => c.platform === MessagePlatform.WebChat)!);
                parsedState.messages[999] = initialMessages[999];
            }
            return parsedState;
        }
    } catch (error) {
        console.error("Failed to parse chat state from localStorage", error);
    }
    const initialState = { conversations: initialConversations, messages: initialMessages };
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
}


export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [conversations, setConversations] = useState<Conversation[]>(() => loadStateFromStorage().conversations);
    const [messages, setMessages] = useState<Record<number, ChatMessage[]>>(() => loadStateFromStorage().messages);

    const updateStateAndStorage = (newConversations: Conversation[], newMessages: Record<number, ChatMessage[]>) => {
        setConversations(newConversations);
        setMessages(newMessages);
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({ conversations: newConversations, messages: newMessages }));
    };

    const handleStorageChange = useCallback((event: StorageEvent) => {
        if (event.key === CHAT_STORAGE_KEY && event.newValue) {
            try {
                const { conversations: newConversations, messages: newMessages } = JSON.parse(event.newValue);
                setConversations(newConversations);
                setMessages(newMessages);
            } catch (error) {
                console.error("Failed to update state from storage change", error);
            }
        }
    }, []);

    useEffect(() => {
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [handleStorageChange]);

    const sendMessage = (conversationId: number, message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        const newMessagesForConversation = messages[conversationId] ? [...messages[conversationId]] : [];
        const newMessage: ChatMessage = {
            ...message,
            id: (newMessagesForConversation.length > 0 ? Math.max(...newMessagesForConversation.map(m => m.id)) : 0) + 1,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ...(message.sender === 'agent' && { agentName: 'Admin User' }),
        };
        
        const updatedMessages = {
            ...messages,
            [conversationId]: [...newMessagesForConversation, newMessage],
        };

        const updatedConversations = conversations.map(convo => {
            if (convo.id === conversationId) {
                return {
                    ...convo,
                    lastMessage: newMessage.text,
                    timestamp: newMessage.timestamp,
                    unreadCount: message.sender === 'user' ? (convo.unreadCount || 0) + 1 : convo.unreadCount,
                };
            }
            return convo;
        });

        updateStateAndStorage(updatedConversations, updatedMessages);
    };

    return (
        <ChatContext.Provider value={{ conversations, messages, sendMessage }}>
            {children}
        </ChatContext.Provider>
    );
};