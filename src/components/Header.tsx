import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useLocalizedPath } from '../hooks/useLocalizedPath';
import { MoonIcon, SunIcon } from './ThemeIcons';
import './Header.css';

export function Header({
  activeSection,
  currentPath,
}: {
  activeSection: string;
  currentPath: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useTranslation();
  const lp = useLocalizedPath();
  const isHome = currentPath === '/';
  const isBlog = currentPath.startsWith('/blog');
  const isWiki = currentPath.startsWith('/wiki');
  const isChallenges = currentPath.startsWith('/challenges');
  const isTravel = currentPath.startsWith('/travel');

  const navItems = [{ id: 'about', label: t.nav.about }];

  const langOptions: { value: typeof locale; label: string }[] = [
    { value: 'en', label: 'EN' },
    { value: 'zh-TW', label: '中' },
  ];

  function handleSectionClick(id: string) {
    setMenuOpen(false);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.assign(`${lp('/')}?scrollTo=${id}`);
    }
  }

  function handleBrandClick() {
    setMenuOpen(false);
    if (isHome) {
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.assign(lp('/'));
    }
  }

  return (
    <header className="site-header">
      <button type="button" className="site-header__brand" onClick={handleBrandClick}>
        guancioul.github.io
      </button>

      <button
        type="button"
        className="site-header__menu-toggle"
        aria-label={t.nav.toggleMenu}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="site-header__menu-icon" />
      </button>

      <nav className={`site-header__nav${menuOpen ? ' site-header__nav--open' : ''}`}>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`site-header__link${isHome && activeSection === item.id ? ' site-header__link--active' : ''}`}
            onClick={() => handleSectionClick(item.id)}
          >
            {item.label}
          </button>
        ))}
        <a
          href={lp('/blog')}
          className={`site-header__link${isBlog ? ' site-header__link--active' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          {t.nav.blog}
        </a>
        <a
          href={lp('/wiki')}
          className={`site-header__link${isWiki ? ' site-header__link--active' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          {t.nav.wiki}
        </a>
        <a
          href={lp('/challenges')}
          className={`site-header__link${isChallenges ? ' site-header__link--active' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          {t.nav.challenges}
        </a>
        <a
          href={lp('/travel')}
          className={`site-header__link${isTravel ? ' site-header__link--active' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          {t.nav.travel}
        </a>
        <div className="site-header__lang-switch" role="group" aria-label={t.nav.switchLanguage}>
          <span
            className="site-header__lang-switch__indicator"
            style={{ transform: `translateX(${langOptions.findIndex((o) => o.value === locale) * 100}%)` }}
          />
          {langOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`site-header__lang-option${locale === option.value ? ' site-header__lang-option--active' : ''}`}
              aria-pressed={locale === option.value}
              onClick={() => setLocale(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="site-header__theme-toggle"
          aria-label={theme === 'dark' ? t.nav.switchToLight : t.nav.switchToDark}
          onClick={toggleTheme}
        >
          <span className="site-header__theme-icon-track">
            <SunIcon
              className={`site-header__theme-icon site-header__theme-icon--sun${
                theme === 'dark' ? ' site-header__theme-icon--hidden' : ' site-header__theme-icon--visible'
              }`}
            />
            <MoonIcon
              className={`site-header__theme-icon site-header__theme-icon--moon${
                theme === 'dark' ? ' site-header__theme-icon--visible' : ' site-header__theme-icon--hidden'
              }`}
            />
          </span>
        </button>
      </nav>
    </header>
  );
}
