import { useEffect, type ReactNode } from 'react';
import { navigate } from 'astro:transitions/client';
import { locales, type Locale } from '../i18n';
import { buildLocaleSwitchUrl, saveLocaleSwitchScroll } from '../lib/locale-scroll';
import { LocaleContext } from './localeContext';

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const setLocale = (next: Locale) => {
    if (next === locale) return;
    saveLocaleSwitchScroll();
    const url = buildLocaleSwitchUrl(
      window.location.pathname,
      window.location.search,
      window.location.hash,
      next,
    );
    void navigate(url);
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', locale === 'zh-TW' ? 'zh-TW' : 'en');
  }, [locale]);

  return <LocaleContext value={{ locale, setLocale, t: locales[locale] }}>{children}</LocaleContext>;
}
