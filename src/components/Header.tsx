import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { name } from '../data/profile';
import { useTheme } from '../hooks/useTheme';
import { MoonIcon, SunIcon } from './ThemeIcons';
import './Header.css';

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'open-source', label: 'Open Source' },
];

export function Header({ activeSection }: { activeSection: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isHome = location.pathname === '/';
  const isBlog = location.pathname.startsWith('/blog');
  const isChallenges = location.pathname.startsWith('/challenges');
  const isTravel = location.pathname.startsWith('/travel');

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
        {name}
      </button>

      <button
        type="button"
        className="site-header__menu-toggle"
        aria-label="Toggle navigation menu"
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
          Blog
        </Link>
        <Link
          to="/challenges"
          className={`site-header__link${isChallenges ? ' site-header__link--active' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          Challenges
        </Link>
        <Link
          to="/travel"
          className={`site-header__link${isTravel ? ' site-header__link--active' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          Travel
        </Link>
        <button
          type="button"
          className="site-header__theme-toggle"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <SunIcon className="site-header__theme-icon" /> : <MoonIcon className="site-header__theme-icon" />}
        </button>
      </nav>
    </header>
  );
}
