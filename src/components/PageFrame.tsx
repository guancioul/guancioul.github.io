import type { ReactNode } from 'react';
import { LocaleProvider } from '../hooks/useLocale';
import { Header } from './Header';
import { Footer } from './Footer';
import '../App.css';

interface PageFrameProps {
  children: ReactNode;
  currentPath: string;
  activeSection?: string;
}

export function PageFrame({ children, currentPath, activeSection = '' }: PageFrameProps) {
  return (
    <LocaleProvider>
      <div className="app">
        <Header activeSection={activeSection} currentPath={currentPath} />
        <main className="app-main">{children}</main>
        <Footer />
      </div>
    </LocaleProvider>
  );
}
