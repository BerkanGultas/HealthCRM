
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useChat } from '../hooks/useChat';
import { MessagePlatform } from '../types';
import { Search, Facebook, Instagram, MessageCircle, FileDown, ChevronDown } from 'lucide-react';

const PlatformIcon: React.FC<{ platform: MessagePlatform }> = ({ platform }) => {
    switch (platform) {
        case MessagePlatform.Facebook: return <Facebook className="w-5 h-5 text-blue-500" />;
        case MessagePlatform.Instagram: return <Instagram className="w-5 h-5 text-pink-500" />;
        case MessagePlatform.WhatsApp: return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
        case MessagePlatform.WebChat: return <MessageCircle className="w-5 h-5 text-[#128c7e]" />;
        default: return <MessageCircle className="w-5 h-5 text-gray-400" />;
    }
}

const Transcript: React.FC = () => {
    const { t } = useLanguage();
    const { conversations, messages } = useChat();
    const [searchTerm, setSearchTerm] = useState('');
    const [platformFilter, setPlatformFilter] = useState('All');
    const [expandedConvoId, setExpandedConvoId] = useState<number | null>(null);

    const filteredConversations = useMemo(() => {
        return conversations
            .filter(convo => {
                const matchesPlatform = platformFilter === 'All' || convo.platform === platformFilter;
                const matchesSearch = searchTerm === '' ||
                    convo.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    convo.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesPlatform && matchesSearch;
            })
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // A proper sort would need better timestamps
    }, [conversations, searchTerm, platformFilter]);

    const platforms = useMemo(() => {
        const platformSet = new Set(conversations.map(c => c.platform));
        return Array.from(platformSet);
    }, [conversations]);

    const handleExportConversation = (conversationId: number) => {
        const conversation = conversations.find(c => c.id === conversationId);
        if (!conversation) {
            console.error("Conversation not found for export");
            return;
        }

        const convoMessages = messages[conversation.id];
        if (!convoMessages || !Array.isArray(convoMessages) || convoMessages.length === 0) {
            alert("No messages to export for this conversation.");
            return;
        }

        const headers = ["Date", "Time", "Sender", "Message"];
        const rows = convoMessages.map(msg => {
            let dateStr = new Date().toLocaleDateString();
            let timeStr = msg.timestamp;

            if (msg.timestamp.toLowerCase() === 'yesterday') {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                dateStr = yesterday.toLocaleDateString();
                timeStr = '';
            }

            const sender = msg.sender === 'agent' 
                ? (msg.agentName || 'Agent') 
                : conversation.customerName;
            
            const escapeCSV = (str: string | undefined) => {
                if (str === undefined || str === null) return '""';
                return `"${String(str).replace(/"/g, '""')}"`;
            };
            
            return [
                escapeCSV(dateStr),
                escapeCSV(timeStr),
                escapeCSV(sender),
                escapeCSV(msg.text)
            ].join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(","), ...rows].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        const sanitizedCustomerName = conversation.customerName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.setAttribute("download", `transcript_${sanitizedCustomerName}.csv`);
        document.body.appendChild(link); 
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{t('transcript.title')}</h2>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder={t('transcript.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64 bg-gray-100 border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-[#128c7e] focus:border-[#128c7e] transition-colors"
                        />
                    </div>
                    <select
                        value={platformFilter}
                        onChange={(e) => setPlatformFilter(e.target.value)}
                        className="bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 focus:ring-[#128c7e] focus:border-[#128c7e] transition-colors"
                    >
                        <option value="All">{t('transcript.allPlatforms')}</option>
                        {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50/50">
                            <th className="p-4 font-semibold">{t('transcript.customer')}</th>
                            <th className="p-4 font-semibold">{t('transcript.lastMessage')}</th>
                            <th className="p-4 font-semibold text-center">{t('transcript.messageCount')}</th>
                            <th className="p-4 font-semibold">{t('transcript.platform')}</th>
                            <th className="p-4 font-semibold">{t('transcript.lastActivity')}</th>
                            <th className="p-4 font-semibold text-center">{t('transcript.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredConversations.map(convo => (
                            <React.Fragment key={convo.id}>
                                <tr onClick={() => setExpandedConvoId(expandedConvoId === convo.id ? null : convo.id)} className="cursor-pointer hover:bg-gray-50 border-b border-gray-200 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={convo.avatarUrl} alt={convo.customerName} className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <p className="font-semibold">{convo.customerName}</p>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <PlatformIcon platform={convo.platform} />
                                                    <span>{convo.platform}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4"><p className="text-gray-600 truncate max-w-xs">{convo.lastMessage}</p></td>
                                    <td className="p-4 text-center font-medium text-gray-600">{messages[convo.id]?.length || 0}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                                            {convo.platform}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">{convo.timestamp}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleExportConversation(convo.id);
                                                }}
                                                title={t('transcript.downloadTranscript')}
                                                className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-100 rounded-full transition-colors"
                                            >
                                                <FileDown size={18} />
                                            </button>
                                             <button className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-200 transition-colors">
                                                <ChevronDown size={20} className={`transition-transform duration-300 ${expandedConvoId === convo.id ? 'rotate-180' : ''}`} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedConvoId === convo.id && (
                                    <tr>
                                        <td colSpan={6} className="p-0">
                                            <div className="p-4 bg-gray-100/50">
                                                <div className="max-h-96 overflow-y-auto p-4 bg-white rounded-md border-2 border-dashed">
                                                    <div className="space-y-4">
                                                        {(!messages[convo.id] || messages[convo.id].length === 0) ? (
                                                            <p className="text-gray-500 text-center py-4">No messages in this conversation.</p>
                                                        ) : (
                                                            messages[convo.id].map(msg => (
                                                                <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'agent' ? 'flex-row-reverse' : ''}`}>
                                                                    <div className={`p-3 rounded-lg max-w-xl shadow-sm ${msg.sender === 'agent' ? 'bg-[#dcf8c6] rounded-br-none' : 'bg-gray-50 rounded-bl-none'}`}>
                                                                        <p className="text-sm text-gray-800">{msg.text}</p>
                                                                        <p className="text-xs text-gray-500 mt-1 text-right">{msg.timestamp}</p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                 {filteredConversations.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        No matching transcripts found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transcript;
