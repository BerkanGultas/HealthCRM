import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../context/ThemeContext';
import { useChat } from '../hooks/useChat';
import { Conversation, ChatMessage, MessagePlatform } from '../types';
import { Facebook, Instagram, MessageCircle, Send, Paperclip, Search, FileText, ArrowLeft } from 'lucide-react';

const PlatformIcon: React.FC<{platform: MessagePlatform}> = ({ platform }) => {
    switch(platform) {
        case MessagePlatform.Facebook: return <Facebook className="w-5 h-5 text-blue-500" />;
        case MessagePlatform.Instagram: return <Instagram className="w-5 h-5 text-pink-500" />;
        case MessagePlatform.WhatsApp: return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
        case MessagePlatform.WebChat: return <MessageCircle className="w-5 h-5 text-[var(--primary)]" />;
        default: return <MessageCircle className="w-5 h-5 text-gray-400" />;
    }
}

const Inbox: React.FC = () => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const { conversations, messages, sendMessage } = useChat();
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const chatBodyRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (activeConversation) {
            const currentConvo = conversations.find(c => c.id === activeConversation.id);
            setActiveConversation(currentConvo || null);
        } else if (conversations.length > 0 && window.innerWidth >= 768) {
             setActiveConversation(conversations.find(c => c.unreadCount > 0) || conversations[0]);
        }
    }, [conversations, activeConversation?.id]);
    
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, activeConversation]);


    const handleSendMessage = () => {
        if (newMessage.trim() && activeConversation) {
            sendMessage(activeConversation.id, {
                sender: 'agent',
                text: newMessage,
            });
            setNewMessage('');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && activeConversation) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileUrl = event.target?.result as string;
                sendMessage(activeConversation.id, {
                    sender: 'agent',
                    text: file.name,
                    attachment: {
                        name: file.name,
                        url: fileUrl,
                        type: file.type,
                    },
                });
            };
            reader.readAsDataURL(file);
            e.target.value = ''; // Reset file input
        }
    };

    const currentMessages = activeConversation ? messages[activeConversation.id] || [] : [];
    const chatBubbleClasses = {
        light: {
            agent: 'bg-[#dcf8c6]',
            user: 'bg-white',
        },
        dark: {
            agent: 'bg-emerald-900',
            user: 'bg-[var(--card-background)]',
        }
    };

    return (
        <div className="flex h-[calc(100vh-8.5rem)] sm:h-[calc(100vh-7rem)] bg-[var(--card-background)] rounded-lg border border-[var(--border)] overflow-hidden relative">
            {/* Conversations List */}
            <div className={`absolute md:static top-0 left-0 h-full w-full md:w-1/3 border-r border-[var(--border)] flex flex-col transition-transform duration-300 ease-in-out ${activeConversation ? '-translate-x-full' : 'translate-x-0'} md:translate-x-0`}>
                <div className="p-4 border-b border-[var(--border)]">
                    <h2 className="text-xl font-semibold">{t('inbox.conversations')}</h2>
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                        <input type="text" placeholder={t('inbox.search')} className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md pl-10 pr-4 py-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(convo => (
                        <div key={convo.id} onClick={() => setActiveConversation(convo)} className={`flex items-start p-4 cursor-pointer hover:bg-[var(--accent)]/50 ${activeConversation?.id === convo.id ? 'bg-[var(--accent)]' : ''}`}>
                            <img src={convo.avatarUrl} className="w-12 h-12 rounded-full object-cover" />
                            <div className="flex-1 ml-3">
                                <div className="flex justify-between">
                                    <h3 className="font-semibold">{convo.customerName}</h3>
                                    <span className="text-xs text-[var(--foreground-muted)]">{convo.timestamp}</span>
                                </div>
                                <p className="text-sm text-[var(--foreground-muted)] truncate">{convo.lastMessage}</p>
                                <div className="flex justify-between items-center mt-1">
                                    <PlatformIcon platform={convo.platform} />
                                    {convo.unreadCount > 0 && <span className="bg-[var(--secondary)] text-[var(--secondary-foreground)] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{convo.unreadCount}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`absolute md:static top-0 left-0 h-full w-full md:w-2/3 flex flex-col bg-[var(--background)] transition-transform duration-300 ease-in-out ${activeConversation ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0`}>
                {activeConversation ? (
                    <>
                        <div className="p-4 border-b border-[var(--border)] flex items-center bg-[var(--card-background)]/80 backdrop-blur-sm">
                            <button onClick={() => setActiveConversation(null)} className="md:hidden mr-2 p-1 rounded-full hover:bg-[var(--accent)]">
                                <ArrowLeft size={20} />
                            </button>
                            <img src={activeConversation.avatarUrl} className="w-12 h-12 rounded-full object-cover" />
                            <div className="ml-3">
                                <h3 className="font-semibold text-lg">{activeConversation.customerName}</h3>
                                <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
                                    <PlatformIcon platform={activeConversation.platform} />
                                    <span>{activeConversation.platform}</span>
                                </div>
                            </div>
                        </div>
                        <div ref={chatBodyRef} className="flex-1 p-6 overflow-y-auto space-y-4">
                           {currentMessages.map(msg => (
                               <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                                   <div className={`max-w-md p-3 rounded-lg shadow-sm ${msg.sender === 'agent' ? chatBubbleClasses[theme].agent : chatBubbleClasses[theme].user}`}>
                                       {msg.attachment ? (
                                           <a
                                             href={msg.attachment.url}
                                             download={msg.attachment.name}
                                             className="flex items-center gap-3 p-2 rounded-md hover:bg-black/5"
                                             aria-label={`Download ${msg.attachment.name}`}
                                           >
                                             <FileText size={32} className="text-gray-600 flex-shrink-0" />
                                             <span className="font-medium underline break-all">{msg.attachment.name}</span>
                                           </a>
                                       ) : msg.isPaymentLink ? (
                                           <a href="#" className="underline text-blue-500 hover:text-blue-400">{msg.text}</a>
                                       ) : (
                                           <p className="whitespace-pre-wrap">{msg.text}</p>
                                       )}
                                       <span className="text-xs text-[var(--foreground-muted)] block text-right mt-1">{msg.timestamp}</span>
                                   </div>
                               </div>
                           ))}
                        </div>
                        <div className="p-4 border-t border-[var(--border)] bg-[var(--input-background)]">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                                    placeholder={t('inbox.typeMessage')}
                                    className="w-full bg-[var(--card-background)] border border-[var(--border)] rounded-full py-3 pl-10 pr-28 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                     <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <button onClick={() => fileInputRef.current?.click()} className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"><Paperclip size={20} /></button>
                                </div>
                                <button onClick={handleSendMessage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full p-2 hover:bg-[var(--primary-hover)]">
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-[var(--foreground-muted)]">{t('inbox.noConversation')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;