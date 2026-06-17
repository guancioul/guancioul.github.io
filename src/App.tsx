import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { NotableContributions } from './pages/NotableContributions';
import { BlogList } from './pages/BlogList';
import { BlogPost } from './pages/BlogPost';
import { NotFound } from './pages/NotFound';
import { useActiveSection } from './hooks/useActiveSection';
import './App.css';

const SECTION_IDS = ['hero', 'about', 'experience', 'skills', 'open-source'];

function App() {
  const activeSection = useActiveSection(SECTION_IDS);
  const location = useLocation();
  const prevPathname = useRef(location.pathname);

  useEffect(() => {
    // Only reset scroll on an actual route change — not on a same-route state update,
    // e.g. Home clearing its own scrollTo state after handling a deep-link scroll itself.
    if (prevPathname.current === location.pathname) return;
    prevPathname.current = location.pathname;

    // Pages with their own hash-anchor or scrollTo deep-link logic handle scroll position themselves.
    if (location.hash || (location.state as { scrollTo?: string } | null)?.scrollTo) return;
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash, location.state]);

  return (
    <div className="app">
      <Header activeSection={activeSection} />
      <main className="app-main">
        <div key={location.pathname} className="page-transition">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notable-contributions" element={<NotableContributions />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
