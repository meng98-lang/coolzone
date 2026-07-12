'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Locale } from './config';
import { locales, defaultLocale } from './config';

type TranslationKeys = Record<string, string>;

interface LanguageContextType {
  locale: Locale;
  t: (key: string) => string;
  translations: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: defaultLocale,
  t: (key: string) => key,
  translations: {},
});

export function LanguageProvider({
  locale,
  translations,
  children,
}: {
  locale: Locale;
  translations: TranslationKeys;
  children: ReactNode;
}) {
  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useLocale(): Locale {
  const { locale } = useContext(LanguageContext);
  return locale;
}

export function useTranslation() {
  const { t, locale } = useContext(LanguageContext);
  return { t, locale };
}
