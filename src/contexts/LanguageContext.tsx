import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'bn' | 'ta' | 'te';

export const LANGUAGES = {
  en: { name: 'English', code: 'en' },
  hi: { name: 'हिन्दी', code: 'hi' },
  bn: { name: 'বাংলা', code: 'bn' },
  ta: { name: 'தமிழ்', code: 'ta' },
  te: { name: 'తెలుగు', code: 'te' },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
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
