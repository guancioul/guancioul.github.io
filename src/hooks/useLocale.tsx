import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { defaultLocale, locales, type Locale } from '../i18n';
import { LocaleContext } from './localeContext';

const STORAGE_KEY = 'locale';

function isLocale(value: string | null): value is Locale {
  return value === 'en' || value === 'zh-TW';
}

function getInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // localStorage unavailable (private mode, quota) — fall through to language detection
  }
  return navigator.language.startsWith('zh') ? 'zh-TW' : defaultLocale;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    document.documentElement.setAttribute('lang', locale);
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // localStorage unavailable — skip persisting
    }
  }, [locale]);

  return <LocaleContext value={{ locale, setLocale, t: locales[locale] }}>{children}</LocaleContext>;
}
