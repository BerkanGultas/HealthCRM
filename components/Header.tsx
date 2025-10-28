import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Language } from '../types';
import { Bell, ChevronDown, Menu, X } from 'lucide-react';

interface HeaderProps {
    pageTitle: string;
    onToggleSidebar: () => void;
    isSidebarOpen: boolean;
}

const languageOptions = [
    { code: Language.EN, name: 'English', flag: '🇬🇧' },
    { code: Language.DE, name: 'Deutsch', flag: '🇩🇪' },
    { code: Language.FR, name: 'Français', flag: '🇫🇷' },
    { code: Language.TR, name: 'Türkçe', flag: '🇹🇷' },
    { code: Language.RU, name: 'Русский', flag: '🇷🇺' },
    { code: Language.AR, name: 'العربية', flag: '🇸🇦' },
];

const Header: React.FC<HeaderProps> = ({ pageTitle, onToggleSidebar, isSidebarOpen }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedLanguage = languageOptions.find(l => l.code === language);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <div className="relative" ref={dropdownRef}>
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

        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="h-6 w-6 text-gray-600" />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        <div className="flex items-center gap-3">
          <img
            src="https://picsum.photos/id/237/200/200"
            alt="Admin Avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="hidden md:block">
            <p className="font-semibold text-gray-800">Admin</p>
            <p className="text-xs text-gray-500">admin@healthcrm.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;