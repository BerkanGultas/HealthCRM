import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useSettings } from '../hooks/useLanguage';
import { useTheme } from '../context/ThemeContext';
import { Facebook, Instagram, MessageCircle, UploadCloud, CheckCircle, XCircle, ChevronDown, CreditCard, FileText } from 'lucide-react';

// Using a simplified WhatsApp icon as it's not in lucide
const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

const webChatSnippet = `<script>
(function() {
    // --- Create CSS ---
    const styles = \`
        #healthcrm-chat-bubble {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background-color: #128c7e;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: transform 0.2s ease-in-out;
            z-index: 9998;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        #healthcrm-chat-bubble:hover {
            transform: scale(1.1);
        }
        #healthcrm-chat-bubble svg {
            width: 32px;
            height: 32px;
        }
        #healthcrm-chat-window {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 90vw;
            max-width: 370px;
            height: 70vh;
            max-height: 600px;
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: opacity 0.3s, transform 0.3s;
            transform-origin: bottom right;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        #healthcrm-chat-window.hidden {
            opacity: 0;
            transform: scale(0.9);
            pointer-events: none;
        }
        #healthcrm-chat-header {
            background-color: #128c7e;
            color: white;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            flex-shrink: 0;
        }
        #healthcrm-chat-header-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        #healthcrm-chat-header-info img {
             width: 40px;
             height: 40px;
             border-radius: 50%;
             object-fit: cover;
        }
        #healthcrm-chat-header-info div {
            display: flex;
            flex-direction: column;
        }
        #healthcrm-chat-header-info span {
            font-size: 16px;
        }
        #healthcrm-chat-header-info small {
            font-size: 12px;
            opacity: 0.9;
        }
        #healthcrm-chat-close {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            line-height: 1;
        }
        #healthcrm-chat-body {
            flex-grow: 1;
            padding: 16px;
            overflow-y: auto;
            background-color: #ece5dd;
            display: flex;
            flex-direction: column;
        }
        .healthcrm-chat-message {
            margin-bottom: 12px;
            max-width: 80%;
            padding: 10px 15px;
            border-radius: 18px;
            word-wrap: break-word;
            line-height: 1.4;
            font-size: 14px;
        }
        .healthcrm-chat-message.welcome {
            background-color: #ffffff;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
        }
        .healthcrm-chat-message.user-sent {
            background-color: #dcf8c6;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }
        #healthcrm-chat-footer {
            padding: 10px;
            border-top: 1px solid #e0e0e0;
            background-color: #f0f0f0;
            display: flex;
            gap: 10px;
            flex-shrink: 0;
        }
        #healthcrm-chat-footer input {
            flex-grow: 1;
            border: 1px solid #ccc;
            border-radius: 20px;
            padding: 10px 15px;
            font-size: 14px;
            outline: none;
        }
        #healthcrm-chat-footer input:focus {
            border-color: #128c7e;
        }
        #healthcrm-chat-footer button {
            background-color: #128c7e;
            color: white;
            border: none;
            border-radius: 50%;
            width: 44px;
            height: 44px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: background-color 0.2s;
        }
        #healthcrm-chat-footer button:hover {
            background-color: #075e54;
        }
        #healthcrm-chat-footer button svg {
            width: 20px;
            height: 20px;
        }
    \`;

    const chatBubbleSVG = \`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>\`;
    const sendButtonSVG = \`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>\`;

    if (document.getElementById('healthcrm-chat-bubble')) return;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const chatBubble = document.createElement('div');
    chatBubble.id = 'healthcrm-chat-bubble';
    chatBubble.innerHTML = chatBubbleSVG;

    const chatWindow = document.createElement('div');
    chatWindow.id = 'healthcrm-chat-window';
    chatWindow.classList.add('hidden');
    chatWindow.innerHTML = \`
        <div id="healthcrm-chat-header">
            <div id="healthcrm-chat-header-info">
                <img src="https://picsum.photos/id/433/40/40" alt="Agent">
                <div>
                    <span>HealthCRM Support</span>
                    <small>We'll reply as soon as possible</small>
                </div>
            </div>
            <button id="healthcrm-chat-close">&times;</button>
        </div>
        <div id="healthcrm-chat-body">
            <div class="healthcrm-chat-message welcome">
                Hello! 👋 How can we help you with your health tourism journey today?
            </div>
        </div>
        <div id="healthcrm-chat-footer">
            <input type="text" id="healthcrm-chat-input" placeholder="Type a message..." />
            <button id="healthcrm-chat-send">\${sendButtonSVG}</button>
        </div>
    \`;

    document.body.appendChild(chatBubble);
    document.body.appendChild(chatWindow);

    const bubble = document.getElementById('healthcrm-chat-bubble');
    const windowEl = document.getElementById('healthcrm-chat-window');
    const closeBtn = document.getElementById('healthcrm-chat-close');

    bubble.addEventListener('click', () => windowEl.classList.toggle('hidden'));
    closeBtn.addEventListener('click', () => windowEl.classList.toggle('hidden'));
    
    // --- Messaging Logic ---
    const CHAT_STORAGE_KEY = 'healthcrm_chats';
    const WEBCHAT_CONVERSATION_ID = 999;
    const sendBtn = document.getElementById('healthcrm-chat-send');
    const inputEl = document.getElementById('healthcrm-chat-input');
    const chatBody = document.getElementById('healthcrm-chat-body');

    const addMessageToUI = (text) => {
        const messageEl = document.createElement('div');
        messageEl.classList.add('healthcrm-chat-message', 'user-sent');
        messageEl.textContent = text;
        chatBody.appendChild(messageEl);
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    const handleSendMessage = () => {
        const messageText = inputEl.value.trim();
        if (!messageText) return;

        addMessageToUI(messageText);

        try {
            const storedStateRaw = localStorage.getItem(CHAT_STORAGE_KEY);
            const state = storedStateRaw ? JSON.parse(storedStateRaw) : { conversations: [], messages: {} };

            let webchatConvo = state.conversations.find(c => c.id === WEBCHAT_CONVERSATION_ID);
            if (!webchatConvo) {
                webchatConvo = {
                    id: WEBCHAT_CONVERSATION_ID,
                    customerName: 'Web Chat Visitor',
                    lastMessage: '',
                    timestamp: '',
                    platform: 'Web Chat',
                    avatarUrl: 'https://picsum.photos/id/1005/200/200',
                    unreadCount: 0,
                };
                state.conversations.push(webchatConvo);
            }

            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const messagesForConvo = state.messages[WEBCHAT_CONVERSATION_ID] || [];
            const newMessage = {
                id: (messagesForConvo.length > 0 ? Math.max(...messagesForConvo.map(m => m.id)) : 0) + 1,
                sender: 'user',
                text: messageText,
                timestamp: timestamp
            };

            state.messages[WEBCHAT_CONVERSATION_ID] = [...messagesForConvo, newMessage];
            const convoIndex = state.conversations.findIndex(c => c.id === WEBCHAT_CONVERSATION_ID);
            state.conversations[convoIndex].lastMessage = messageText;
            state.conversations[convoIndex].timestamp = timestamp;
            state.conversations[convoIndex].unreadCount = (state.conversations[convoIndex].unreadCount || 0) + 1;
            
            localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('HealthCRM Widget Error:', e);
        }
        
        inputEl.value = '';
    };

    sendBtn.addEventListener('click', handleSendMessage);
    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });
})();
</script>`;

const IntegrationCard: React.FC<{
    platformName: string; 
    icon: React.ReactNode; 
    isConnected: boolean; 
    onToggle: () => void;
    children: React.ReactNode; 
    isOpen: boolean 
}> = ({ platformName, icon, isConnected, onToggle, children, isOpen }) => {
    const { t } = useLanguage();
    return (
        <div className="bg-[var(--input-background)] p-4 rounded-lg border border-[var(--border)]">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {icon}
                    <h4 className="font-semibold">{platformName}</h4>
                </div>
                <div className="flex items-center gap-3">
                    {isConnected ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                            <CheckCircle size={14} /> {t('settings.connected')}
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-[var(--foreground-muted)] bg-[var(--accent)] px-2 py-1 rounded-full">
                            <XCircle size={14} /> Disconnected
                        </span>
                    )}
                    <button onClick={onToggle} className="p-1 text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-full hover:bg-[var(--accent)] transition-colors">
                       <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                   {children}
                </div>
            )}
        </div>
    );
};

const COMPANY_INFO_STORAGE_KEY = 'healthcrm_company_info';

const Settings: React.FC = () => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const { logoUrl, setLogoUrl } = useSettings();
    const [openIntegration, setOpenIntegration] = useState<string | null>(null);

    const [companyInfo, setCompanyInfo] = useState({
        address: '',
        phone: '',
        email: '',
    });

    useEffect(() => {
        try {
            const storedInfo = localStorage.getItem(COMPANY_INFO_STORAGE_KEY);
            if (storedInfo) {
                setCompanyInfo(JSON.parse(storedInfo));
            } else {
                 setCompanyInfo({
                    address: '123 Health St, Wellness City, 12345',
                    phone: '(123) 456-7890',
                    email: 'contact@healthcrm.com',
                });
            }
        } catch (error) {
            console.error("Failed to load company info from localStorage", error);
        }
    }, []);

    const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCompanyInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveCompanyInfo = () => {
        try {
            localStorage.setItem(COMPANY_INFO_STORAGE_KEY, JSON.stringify(companyInfo));
            alert('Company information saved!');
        } catch (error) {
            console.error("Failed to save company info to localStorage", error);
            alert('Failed to save company information.');
        }
    };

    const [integrations, setIntegrations] = useState({
        facebook: { connected: true, appId: '123456789012345', pageId: '987654321098765' },
        instagram: { connected: false, businessId: '' },
        whatsapp: { connected: true, phoneId: '112233445566778' },
        webchat: { connected: true, snippet: webChatSnippet },
        virtualpos: { connected: false, apiKey: '', secretKey: '', merchantId: '' },
        gib: { connected: false, username: '', password: '', eFaturaPrefix: '', eArsivPrefix: '' },
    });
    
    const handleToggleIntegration = (platformKey: string) => {
        setOpenIntegration(prev => prev === platformKey ? null : platformKey);
    };
    
    const snippetTextareaClass = theme === 'dark' 
      ? "w-full bg-stone-900 text-green-400 font-mono text-sm border border-[var(--border)] rounded-md p-2 mt-1"
      : "w-full bg-gray-100 text-gray-800 font-mono text-sm border border-[var(--border)] rounded-md p-2 mt-1";

    return (
        <div className="space-y-6">
            <div className="bg-[var(--card-background)] p-6 rounded-lg border border-[var(--border)]">
                <h3 className="text-lg font-semibold mb-4">{t('settings.companyInfo')}</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-[var(--foreground-muted)]">{t('settings.address')}</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={companyInfo.address}
                            onChange={handleCompanyInfoChange}
                            placeholder="123 Health St, Wellness City, 12345"
                            className="mt-1 block w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-[var(--foreground-muted)]">{t('settings.phone')}</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={companyInfo.phone}
                            onChange={handleCompanyInfoChange}
                            placeholder="(123) 456-7890"
                            className="mt-1 block w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground-muted)]">{t('settings.email')}</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={companyInfo.email}
                            onChange={handleCompanyInfoChange}
                            placeholder="contact@healthcrm.com"
                            className="mt-1 block w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <button onClick={handleSaveCompanyInfo} className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition-colors">{t('settings.save')}</button>
                </div>
            </div>

            <div className="bg-[var(--card-background)] p-6 rounded-lg border border-[var(--border)]">
                <h3 className="text-lg font-semibold mb-4">{t('settings.logoSettings')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                        <label htmlFor="logoUrl" className="block text-sm font-medium text-[var(--foreground-muted)]">{t('settings.logoUrl')}</label>
                        <input
                            type="text"
                            id="logoUrl"
                            value={logoUrl}
                            onChange={(e) => setLogoUrl(e.target.value)}
                            placeholder="https://example.com/logo.png"
                            className="mt-1 block w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                        />
                         <button className="mt-4 w-full md:w-auto flex items-center justify-center gap-2 bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded-lg hover:bg-[var(--primary-hover)] transition-colors">
                            <UploadCloud size={18} />
                            <span>{t('settings.uploadLogo')}</span>
                        </button>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-[var(--foreground-muted)] mb-2">{t('settings.logoPreview')}</p>
                        <div className="h-24 flex items-center justify-center bg-[var(--background)] rounded-md border-2 border-dashed border-[var(--border)] p-2">
                           {logoUrl ? (
                               <img src={logoUrl} alt="Logo Preview" className="max-h-20 object-contain"/>
                           ) : (
                                <h1 className="text-2xl font-bold text-[var(--card-foreground)]">
                                    <span className="text-[var(--primary)]">Health</span>CRM
                                </h1>
                           )}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-[var(--card-background)] p-6 rounded-lg border border-[var(--border)]">
                <h3 className="text-lg font-semibold mb-4">{t('settings.paymentIntegrations')}</h3>
                 <div className="space-y-4">
                    <IntegrationCard
                        platformName={t('settings.platform.virtualpos')}
                        icon={<CreditCard className="w-6 h-6 text-blue-500" />}
                        isConnected={integrations.virtualpos.connected}
                        isOpen={openIntegration === 'virtualpos'}
                        onToggle={() => handleToggleIntegration('virtualpos')}
                    >
                       <div className="space-y-3">
                           <div>
                               <label className="text-sm font-medium text-[var(--foreground-muted)]">{t('settings.apiKey')}</label>
                               <input type="text" placeholder="Enter API Key" className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1" />
                           </div>
                            <div>
                               <label className="text-sm font-medium text-[var(--foreground-muted)]">{t('settings.secretKey')}</label>
                               <input type="password" placeholder="Enter Secret Key" className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1" />
                           </div>
                           <div>
                               <label className="text-sm font-medium text-[var(--foreground-muted)]">{t('settings.merchantId')}</label>
                               <input type="text" placeholder="Enter Merchant ID" className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1" />
                           </div>
                           <button className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition-colors">{t('settings.save')}</button>
                       </div>
                    </IntegrationCard>

                    <IntegrationCard
                        platformName={t('settings.platform.gib')}
                        icon={<FileText className="w-6 h-6 text-indigo-500" />}
                        isConnected={integrations.gib.connected}
                        isOpen={openIntegration === 'gib'}
                        onToggle={() => handleToggleIntegration('gib')}
                    >
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-[var(--foreground-muted)]">{t('settings.gibUsername')}</label>
                                <input type="text" placeholder="Enter GIB Username" className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[var(--foreground-muted)]">{t('settings.gibPassword')}</label>
                                <input type="password" placeholder="Enter GIB Password" className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-[var(--foreground-muted)]">{t('settings.eFaturaPrefix')}</label>
                                    <input type="text" placeholder="e.g., ABC" className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[var(--foreground-muted)]">{t('settings.eArsivPrefix')}</label>
                                    <input type="text" placeholder="e.g., XYZ" className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1" />
                                </div>
                            </div>
                            <button className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition-colors">{t('settings.save')}</button>
                        </div>
                    </IntegrationCard>
                 </div>
            </div>

            <div className="bg-[var(--card-background)] p-6 rounded-lg border border-[var(--border)]">
                <h3 className="text-lg font-semibold mb-4">{t('settings.messagingPlatforms')}</h3>
                <div className="space-y-4">
                    <IntegrationCard
                        platformName={t('settings.platform.facebook')}
                        icon={<Facebook className="w-6 h-6 text-blue-600" />}
                        isConnected={integrations.facebook.connected}
                        isOpen={openIntegration === 'facebook'}
                        onToggle={() => handleToggleIntegration('facebook')}
                    >
                       <div className="space-y-3">
                           <div>
                               <label className="text-sm font-medium text-[var(--foreground-muted)]">{t('settings.appId')}</label>
                               <input type="text" defaultValue={integrations.facebook.appId} className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1" />
                           </div>
                            <div>
                               <label className="text-sm font-medium text-[var(--foreground-muted)]">{t('settings.pageId')}</label>
                               <input type="text" defaultValue={integrations.facebook.pageId} className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1" />
                           </div>
                           <button className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition-colors">{t('settings.save')}</button>
                       </div>
                    </IntegrationCard>

                    <IntegrationCard
                        platformName={t('settings.platform.instagram')}
                        icon={<Instagram className="w-6 h-6 text-pink-500" />}
                        isConnected={integrations.instagram.connected}
                        isOpen={openIntegration === 'instagram'}
                        onToggle={() => handleToggleIntegration('instagram')}
                    >
                       <div className="space-y-3">
                           <div>
                               <label className="text-sm font-medium text-[var(--foreground-muted)]">{t('settings.businessAccountId')}</label>
                               <input type="text" placeholder="Enter Business Account ID" className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1" />
                           </div>
                           <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">{t('settings.connect')}</button>
                       </div>
                    </IntegrationCard>

                     <IntegrationCard
                        platformName={t('settings.platform.whatsapp')}
                        icon={<WhatsAppIcon />}
                        isConnected={integrations.whatsapp.connected}
                        isOpen={openIntegration === 'whatsapp'}
                        onToggle={() => handleToggleIntegration('whatsapp')}
                    >
                         <div className="space-y-3">
                           <div>
                               <label className="text-sm font-medium text-[var(--foreground-muted)]">{t('settings.phoneNumberId')}</label>
                               <input type="text" defaultValue={integrations.whatsapp.phoneId} className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-md p-2 mt-1" />
                           </div>
                           <button className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition-colors">{t('settings.save')}</button>
                       </div>
                    </IntegrationCard>

                     <IntegrationCard
                        platformName={t('settings.platform.webchat')}
                        icon={<MessageCircle className="w-6 h-6 text-[var(--primary)]" />}
                        isConnected={integrations.webchat.connected}
                        isOpen={openIntegration === 'webchat'}
                        onToggle={() => handleToggleIntegration('webchat')}
                    >
                        <div>
                           <label className="text-sm font-medium text-[var(--foreground-muted)]">{t('settings.widgetSnippet')}</label>
                            <textarea
                                rows={5}
                                readOnly
                                value={integrations.webchat.snippet}
                                className={snippetTextareaClass}
                            />
                             <button onClick={() => navigator.clipboard.writeText(integrations.webchat.snippet)} className="mt-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-opacity-75 transition-colors">{t('settings.copyCode')}</button>
                        </div>
                    </IntegrationCard>

                </div>
            </div>
        </div>
    );
};

export default Settings;