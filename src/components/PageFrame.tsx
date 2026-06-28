import type { ReactNode } from 'react';
import type { Locale } from '../i18n';
import { LocaleProvider } from '../hooks/useLocale';
import { Header } from './Header';
import { Footer } from './Footer';
import '../App.css';

interface PageFrameProps {
  children: ReactNode;
  locale: Locale;
  /** Locale-neutral path, e.g. `/wiki/foo` (no `/zh-TW` prefix). */
  currentPath: string;
  activeSection?: string;
}

export function PageFrame({ children, locale, currentPath, activeSection = '' }: PageFrameProps) {
  return (
    <LocaleProvider locale={locale}>
      <div className="app">
        <Header activeSection={activeSection} currentPath={currentPath} />
        <main className="app-main">{children}</main>
        <Footer />
      </div>
    </LocaleProvider>
  );
}
