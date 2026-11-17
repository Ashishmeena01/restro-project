'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  translations,
  Language,
  translateDish as translateDishHelper,
  translateCategory as translateCategoryHelper,
  translateDescription as translateDescriptionHelper,
  translateStatus as translateStatusHelper,
  translatePaymentMethod as translatePaymentMethodHelper,
} from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isHindi: boolean;
  t: (key: string, fallback?: string) => string;
  translateDish: (name: string) => string;
  translateCategory: (name: string) => string;
  translateDescription: (desc: string | null | undefined) => string;
  translateStatus: (status: string) => { label: string; desc: string };
  translatePaymentMethod: (method: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to Hindi ('hi') as requested by user
  const [language, setLanguageState] = useState<Language>('hi');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('vrindavan_lang');
      if (saved === 'en' || saved === 'hi') {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      } else {
        // Default to Hindi
        localStorage.setItem('vrindavan_lang', 'hi');
        document.documentElement.lang = 'hi';
      }
    } catch (e) {
      // Storage unavailable fallback
    } finally {
      setIsReady(true);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('vrindavan_lang', lang);
      document.documentElement.lang = lang;
    } catch (e) {
      // Storage unavailable fallback
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  const t = (key: string, fallback?: string): string => {
    const currentDict = translations[language];
    if (currentDict && key in currentDict) {
      return currentDict[key];
    }
    const englishDict = translations.en;
    if (englishDict && key in englishDict) {
      return englishDict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isHindi: language === 'hi',
        t,
        translateDish: (name: string) => translateDishHelper(name, language),
        translateCategory: (name: string) => translateCategoryHelper(name, language),
        translateDescription: (desc: string | null | undefined) => translateDescriptionHelper(desc, language),
        translateStatus: (status: string) => translateStatusHelper(status, language),
        translatePaymentMethod: (method: string) => translatePaymentMethodHelper(method, language),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

