'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import translations, { Language } from './translations';

const STORAGE_KEY = 'titezme_lang';

function detectLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'fr' || saved === 'es' || saved === 'en') return saved;
  const browser = navigator.language.toLowerCase();
  if (browser.startsWith('fr')) return 'fr';
  if (browser.startsWith('es')) return 'es';
  return 'en';
}

type LangContextType = {
  lang: Language;
  setLang: (l: Language) => void;
  t: (path: string) => string;
};

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (path) => path,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    setLangState(detectLanguage());
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = translations[lang];
    for (const key of keys) {
      if (current?.[key] === undefined) {
        let fallback: any = translations.en;
        for (const k of keys) {
          fallback = fallback?.[k];
        }
        return fallback ?? path;
      }
      current = current[key];
    }
    return current ?? path;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
