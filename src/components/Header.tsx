import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { MoonIcon, SunIcon } from './ThemeIcons';
import './Header.css';

export function Header({ activeSection }: { activeSection: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useTranslation();
  const isHome = location.pathname === '/';
  const isBlog = location.pathname.startsWith('/blog');
  const isChallenges = location.pathname.startsWith('/challenges');
  const isTravel = location.pathname.startsWith('/travel');

  const navItems = [
    { id: 'about', label: t.nav.about },
    { id: 'experience', label: t.nav.experience },
    { id: 'skills', label: t.nav.skills },
    { id: 'open-source', label: t.nav.openSource },
  ];

  const langOptions: { value: typeof locale; label: string }[] = [
    { value: 'en', label: 'EN' },
    { value: 'zh-TW', label: '中' },
  ];

  function handleSectionClick(id: string) {
    setMenuOpen(false);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  }

  function handleBrandClick() {
    setMenuOpen(false);
    if (isHome) {
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/');
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
        <Link
          to="/blog"
          className={`site-header__link${isBlog ? ' site-header__link--active' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          {t.nav.blog}
        </Link>
        <Link
          to="/challenges"
          className={`site-header__link${isChallenges ? ' site-header__link--active' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          {t.nav.challenges}
        </Link>
        <Link
          to="/travel"
          className={`site-header__link${isTravel ? ' site-header__link--active' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          {t.nav.travel}
        </Link>
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
          {theme === 'dark' ? <SunIcon className="site-header__theme-icon" /> : <MoonIcon className="site-header__theme-icon" />}
        </button>
      </nav>
    </header>
  );
}
