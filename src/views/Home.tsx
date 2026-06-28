import { useEffect, useRef } from 'react';
import { Hero } from '../components/Hero';
import { ScrollDots } from '../components/ScrollDots';
import { useActiveSection } from '../hooks/useActiveSection';
import { About } from './About';
import { Experience } from './Experience';
import { Skills } from './Skills';
import { OpenSource } from './OpenSource';

const SECTION_IDS = ['hero', 'about', 'experience', 'skills', 'open-source'];

export function Home() {
  const activeSection = useActiveSection(SECTION_IDS);
  const hasScrolled = useRef(false);

  useEffect(() => {
    const scrollTo = new URLSearchParams(window.location.search).get('scrollTo');
    if (scrollTo && !hasScrolled.current) {
      hasScrolled.current = true;
      document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState({}, '', '/');
    }
  }, []);

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

export { SECTION_IDS as HOME_SECTION_IDS };
