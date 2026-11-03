import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES, translations } from '../locales/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(() => {
    const saved = localStorage.getItem('signora_language');
    return saved && translations[saved] ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('signora_language', currentLang);
    const langMeta = LANGUAGES.find((l) => l.code === currentLang);
    if (langMeta) {
      document.documentElement.setAttribute('lang', langMeta.code);
      document.documentElement.setAttribute('dir', langMeta.dir);
    }
  }, [currentLang]);

  const setLanguage = (langCode) => {
    if (translations[langCode]) {
      setCurrentLang(langCode);
    }
  };

  const t = (key) => {
    const langDict = translations[currentLang] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  const isRTL = LANGUAGES.find((l) => l.code === currentLang)?.dir === 'rtl';

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        setLanguage,
        t,
        isRTL,
        availableLanguages: LANGUAGES,
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
