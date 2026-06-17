import { Link, useLocation, useNavigate } from 'react-router-dom';
import { name } from '../data/profile';
import './Header.css';

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'open-source', label: 'Open Source' },
];

export function Header({ activeSection }: { activeSection: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const isBlog = location.pathname.startsWith('/blog');

  function handleSectionClick(id: string) {
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  }

  function handleBrandClick() {
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
      <nav className="site-header__nav">
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
        <Link to="/blog" className={`site-header__link${isBlog ? ' site-header__link--active' : ''}`}>
          Blog
        </Link>
      </nav>
    </header>
  );
}
