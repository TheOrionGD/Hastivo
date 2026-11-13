import { useState, useEffect } from "react";
import {
  getStoredLanguage,
  setStoredLanguage,
  getLocalizedStrings,
  getLanguageMetadata,
  SUPPORTED_LANGUAGES,
} from "@/lib/multilingual";

export function useLanguage() {
  const [currentLang, setCurrentLang] = useState(() => getStoredLanguage());

  useEffect(() => {
    const handleLangChange = (e) => {
      if (e.detail) {
        setCurrentLang(e.detail);
      }
    };
    window.addEventListener("hastivo-language-changed", handleLangChange);
    return () => window.removeEventListener("hastivo-language-changed", handleLangChange);
  }, []);

  const changeLanguage = (code) => {
    setStoredLanguage(code);
    setCurrentLang(code);
  };

  const t = getLocalizedStrings(currentLang);
  const meta = getLanguageMetadata(currentLang);

  return {
    currentLang,
    changeLanguage,
    t,
    meta,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}

export default useLanguage;
