import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useChat } from '../hooks/useChat';
import { Conversation, ChatMessage, MessagePlatform } from '../types';
import { Facebook, Instagram, MessageCircle, Send, Paperclip, DollarSign, Search } from 'lucide-react';

const PlatformIcon: React.FC<{platform: MessagePlatform}> = ({ platform }) => {
    switch(platform) {
        case MessagePlatform.Facebook: return <Facebook className="w-5 h-5 text-blue-500" />;
        case MessagePlatform.Instagram: return <Instagram className="w-5 h-5 text-pink-500" />;
        case MessagePlatform.WhatsApp: return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
        case MessagePlatform.WebChat: return <MessageCircle className="w-5 h-5 text-[#128c7e]" />;
        default: return <MessageCircle className="w-5 h-5 text-gray-400" />;
    }
}

const PaymentLinkModal: React.FC<{ onGenerate: (link: string) => void; onCancel: () => void }> = ({ onGenerate, onCancel }) => {
    const { t } = useLanguage();
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');

    const handleGenerate = () => {
        if(amount) {
            onGenerate(`${t('inbox.paymentLinkMessage')} https://payment.link/mock/${currency.toLowerCase()}${amount}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">{t('inbox.generatePaymentLink')}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-500">{t('inbox.amount')}</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 mt-1 focus:ring-[#128c7e] focus:border-[#128c7e]" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-500">{t('inbox.currency')}</label>
                        <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 mt-1 focus:ring-[#128c7e] focus:border-[#128c7e]">
                            <option>USD</option>
                            <option>EUR</option>
                            <option>GBP</option>
                            <option>TRY</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onCancel} className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">{t('inbox.cancel')}</button>
                    <button onClick={handleGenerate} className="px-4 py-2 rounded-md bg-[#128c7e] text-white hover:bg-[#075e54]">{t('inbox.generateLink')}</button>
                </div>
            </div>
        </div>
    );
};


const Inbox: React.FC = () => {
    const { t } = useLanguage();
    const { conversations, messages, sendMessage } = useChat();
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const chatBodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeConversation) {
            const currentConvo = conversations.find(c => c.id === activeConversation.id);
            setActiveConversation(currentConvo || null);
        } else if (conversations.length > 0) {
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
    
    const handleGeneratePaymentLink = (link: string) => {
        if (activeConversation) {
            sendMessage(activeConversation.id, {
                sender: 'agent',
                text: link,
                isPaymentLink: true,
            });
        }
        setModalOpen(false);
    }

    const currentMessages = activeConversation ? messages[activeConversation.id] || [] : [];

    return (
        <div className="flex h-[calc(100vh-7rem)] bg-white rounded-lg border border-gray-200 overflow-hidden">
            {isModalOpen && <PaymentLinkModal onGenerate={handleGeneratePaymentLink} onCancel={() => setModalOpen(false)} />}
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">{t('inbox.conversations')}</h2>
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                        <input type="text" placeholder={t('inbox.search')} className="w-full bg-gray-100 border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:ring-[#128c7e] focus:border-[#128c7e]" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(convo => (
                        <div key={convo.id} onClick={() => setActiveConversation(convo)} className={`flex items-start p-4 cursor-pointer hover:bg-gray-100 ${activeConversation?.id === convo.id ? 'bg-[#25d366]/10' : ''}`}>
                            <img src={convo.avatarUrl} className="w-12 h-12 rounded-full object-cover" />
                            <div className="flex-1 ml-3">
                                <div className="flex justify-between">
                                    <h3 className="font-semibold">{convo.customerName}</h3>
                                    <span className="text-xs text-gray-500">{convo.timestamp}</span>
                                </div>
                                <p className="text-sm text-gray-500 truncate">{convo.lastMessage}</p>
                                <div className="flex justify-between items-center mt-1">
                                    <PlatformIcon platform={convo.platform} />
                                    {convo.unreadCount > 0 && <span className="bg-[#25d366] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{convo.unreadCount}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="w-2/3 flex flex-col bg-[#ece5dd]">
                {activeConversation ? (
                    <>
                        <div className="p-4 border-b border-gray-200 flex items-center bg-white/80 backdrop-blur-sm">
                            <img src={activeConversation.avatarUrl} className="w-12 h-12 rounded-full object-cover" />
                            <div className="ml-3">
                                <h3 className="font-semibold text-lg">{activeConversation.customerName}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <PlatformIcon platform={activeConversation.platform} />
                                    <span>{activeConversation.platform}</span>
                                </div>
                            </div>
                        </div>
                        <div ref={chatBodyRef} className="flex-1 p-6 overflow-y-auto space-y-4">
                           {currentMessages.map(msg => (
                               <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                                   <div className={`max-w-md p-3 rounded-lg shadow-sm ${msg.sender === 'agent' ? 'bg-[#dcf8c6]' : 'bg-white'}`}>
                                       {msg.isPaymentLink ? (
                                           <a href="#" className="underline text-blue-600 hover:text-blue-800">{msg.text}</a>
                                       ) : (
                                           <p className="text-gray-800">{msg.text}</p>
                                       )}
                                       <span className="text-xs text-gray-500 block text-right mt-1">{msg.timestamp}</span>
                                   </div>
                               </div>
                           ))}
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-100">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                                    placeholder={t('inbox.typeMessage')}
                                    className="w-full bg-white border border-gray-300 rounded-full py-3 pl-12 pr-28 focus:ring-[#128c7e] focus:border-[#128c7e]"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-3">
                                    <button className="text-gray-500 hover:text-gray-800"><Paperclip size={20} /></button>
                                    <button onClick={() => setModalOpen(true)} className="text-gray-500 hover:text-gray-800"><DollarSign size={20} /></button>
                                </div>
                                <button onClick={handleSendMessage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#128c7e] text-white rounded-full p-2 hover:bg-[#075e54]">
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500">{t('inbox.noConversation')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;
