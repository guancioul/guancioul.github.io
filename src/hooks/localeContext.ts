import { createContext } from 'react';
import { locales, type Locale } from '../i18n';

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof locales[Locale];
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);
