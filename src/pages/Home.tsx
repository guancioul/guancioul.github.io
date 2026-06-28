import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { ScrollDots } from '../components/ScrollDots';
import { useActiveSection } from '../hooks/useActiveSection';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useTranslation } from '../hooks/useTranslation';
import { About } from './About';
import { Experience } from './Experience';
import { Skills } from './Skills';
import { OpenSource } from './OpenSource';

const SECTION_IDS = ['hero', 'about', 'experience', 'skills', 'open-source'];

export function Home() {
  const { t } = useTranslation();
  const activeSection = useActiveSection(SECTION_IDS);
  const location = useLocation();

  useDocumentTitle(undefined, t.common.name);
  const navigate = useNavigate();
  const hasScrolled = useRef(false);

  useEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (scrollTo && !hasScrolled.current) {
      hasScrolled.current = true;
      document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <OpenSource />
      <ScrollDots activeSection={activeSection} />
    </>
  );
}
