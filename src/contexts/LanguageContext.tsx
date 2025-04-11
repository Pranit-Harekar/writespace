import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import i18n from 'i18next';

export type Language = 'en';

export const LANGUAGES = {
  en: { name: 'English', code: 'en' },
  hi: { name: 'हिंदी', code: 'hi' },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'en';
  });

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage); // Update i18next language
    localStorage.setItem('language', newLanguage); // Persist language in localStorage
  };

  useEffect(() => {
    i18n.changeLanguage(language); // Ensure i18next uses the persisted language on load
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
