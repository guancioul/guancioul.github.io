import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { BlogList } from './pages/BlogList';
import { BlogPost } from './pages/BlogPost';
import { useActiveSection } from './hooks/useActiveSection';
import './App.css';

const SECTION_IDS = ['hero', 'about', 'open-source'];

function App() {
  const activeSection = useActiveSection(SECTION_IDS);
  const location = useLocation();

  return (
    <div className="app">
      <Header activeSection={activeSection} />
      <main className="app-main">
        <div key={location.pathname} className="page-transition">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
