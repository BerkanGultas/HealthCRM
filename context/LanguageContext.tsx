import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(Language.TR);

  const t = (key: string, options?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key;
      }
    }
    
    if (typeof result === 'string') {
        if (options) {
            return Object.entries(options).reduce((str, [optKey, value]) => {
                return str.replace(`{${optKey}}`, String(value));
            }, result);
        }
        return result;
    }

    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};


// --- Settings Context ---
const SETTINGS_STORAGE_KEY = 'healthcrm_settings';

interface SettingsContextType {
  logoUrl: string;
  setLogoUrl: (url: string) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const loadSettingsFromStorage = () => {
    try {
        const storedState = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (storedState) {
            return JSON.parse(storedState);
        }
    } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
    }
    return { logoUrl: '' };
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logoUrl, setLogoUrlState] = useState<string>(() => loadSettingsFromStorage().logoUrl);

  const setLogoUrl = (url: string) => {
    setLogoUrlState(url);
    try {
        const settings = { logoUrl: url };
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
        console.error("Failed to save settings to localStorage", e);
    }
  };

  return (
    <SettingsContext.Provider value={{ logoUrl, setLogoUrl }}>
      {children}
    </SettingsContext.Provider>
  );
};