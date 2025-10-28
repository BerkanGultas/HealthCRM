
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Language, User } from '../types';
import { Bell, ChevronDown, Menu, X, CheckCircle2, XCircle, AlertCircle, UserCircle, LogOut } from 'lucide-react';

interface HeaderProps {
    pageTitle: string;
    onToggleSidebar: () => void;
    isSidebarOpen: boolean;
    setActivePage: (page: string) => void;
    onLogout: () => void;
    currentUserRole: User['role'];
}

const languageOptions = [
    { code: Language.EN, name: 'English', flag: '🇬🇧' },
    { code: Language.DE, name: 'Deutsch', flag: '🇩🇪' },
    { code: Language.FR, name: 'Français', flag: '🇫🇷' },
    { code: Language.TR, name: 'Türkçe', flag: '🇹🇷' },
    { code: Language.RU, name: 'Русский', flag: '🇷🇺' },
    { code: Language.AR, name: 'العربية', flag: '🇸🇦' },
];

type Notification = {
  id: number;
  type: 'success' | 'error' | 'warning';
  titleKey: string;
  messageKey: string;
  amount?: string;
  customer?: string;
  timestamp: string;
  read: boolean;
};

const Header: React.FC<HeaderProps> = ({ pageTitle, onToggleSidebar, isSidebarOpen, setActivePage, onLogout, currentUserRole }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const langDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedLanguage = languageOptions.find(l => l.code === language);
  
  // Initial load and simulation of notifications
  useEffect(() => {
    const initialNotifications: Notification[] = [
        { id: 1, type: 'success', titleKey: 'paymentReceivedTitle', messageKey: 'paymentReceivedMessage', amount: '$3,500', customer: 'Alice Johnson', timestamp: '5m ago', read: false },
        { id: 2, type: 'error', titleKey: 'paymentDeclinedTitle', messageKey: 'paymentDeclinedMessage', customer: 'Charlie Brown', timestamp: '1h ago', read: false },
    ];
    setNotifications(initialNotifications);
    setUnreadCount(initialNotifications.filter(n => !n.read).length);

    const interval = setInterval(() => {
        setNotifications(prev => {
            const newNotification: Notification = {
                id: Date.now(),
                type: 'warning',
                titleKey: 'paymentCanceledTitle',
                messageKey: 'paymentCanceledMessage',
                customer: 'Bob Williams',
                timestamp: 'Just now',
                read: false
            };
            return [newNotification, ...prev];
        });
        setUnreadCount(prev => prev + 1);
    }, 30000); // New notification every 30 seconds for demo

    return () => clearInterval(interval);
}, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleNotifications = () => {
    setNotificationDropdownOpen(prev => !prev);
    if (!isNotificationDropdownOpen) {
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'success': return <CheckCircle2 className="w-6 h-6 text-green-500" />;
        case 'error': return <XCircle className="w-6 h-6 text-red-500" />;
        case 'warning': return <AlertCircle className="w-6 h-6 text-yellow-500" />;
        default: return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };


  return (
    <header className="flex-shrink-0 h-20 bg-white/80 backdrop-blur-lg border-b border-gray-200 flex items-center justify-between px-6">
       <div className="flex items-center">
         <button onClick={onToggleSidebar} className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors">
          {isSidebarOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </button>
        <div>
            <h1 className="text-xl font-semibold text-gray-800">{t(`sidebar.${pageTitle.toLowerCase()}`)}</h1>
            <p className="text-sm text-gray-500">{t('header.welcome')}</p>
        </div>
       </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={langDropdownRef}>
            <button
                onClick={() => setLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
                <span className="text-xl">{selectedLanguage?.flag}</span>
                <span className="hidden md:inline text-sm font-medium">{selectedLanguage?.name}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
            {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {languageOptions.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code);
                                setLangDropdownOpen(false);
                            }}
                            className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <span className="text-xl">{lang.flag}</span>
                            <span>{lang.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>

        <div className="relative" ref={notificationDropdownRef}>
            <button onClick={handleToggleNotifications} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bell className="h-6 w-6 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ring-2 ring-white">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isNotificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-3 font-semibold border-b">{t('header.notifications.title')}</div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? notifications.map(n => (
                            <div key={n.id} className={`flex items-start gap-3 p-3 border-b last:border-b-0 ${!n.read ? 'bg-blue-50/50' : 'bg-white'}`}>
                                <div className="flex-shrink-0 mt-1">{getNotificationIcon(n.type)}</div>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm text-gray-800">{t(`header.notifications.${n.titleKey}`)}</p>
                                    <p className="text-sm text-gray-600">
                                        {t(`header.notifications.${n.messageKey}`, { amount: n.amount, customer: n.customer })}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{n.timestamp}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="p-4 text-center text-sm text-gray-500">{t('header.notifications.noNotifications')}</p>
                        )}
                    </div>
                </div>
            )}
        </div>


        <div className="relative" ref={profileDropdownRef}>
            <button onClick={() => setProfileDropdownOpen(prev => !prev)} className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors">
              <img
                src="https://picsum.photos/id/237/200/200"
                alt="Admin Avatar"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="hidden md:block text-left">
                <p className="font-semibold text-gray-800">{currentUserRole}</p>
                <p className="text-xs text-gray-500">{`${currentUserRole.toLowerCase()}@healthcrm.com`}</p>
              </div>
               <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform hidden md:block ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 animate-fade-in-down">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setActivePage('Profile');
                            setProfileDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <UserCircle size={16} />
                        <span>{t('sidebar.profile')}</span>
                    </a>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onLogout();
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <LogOut size={16} />
                        <span>{t('sidebar.logout')}</span>
                    </a>
                </div>
            )}
             <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { animation: fade-in-down 0.2s ease-out forwards; }
            `}</style>
        </div>
      </div>
    </header>
  );
};

export default Header;
