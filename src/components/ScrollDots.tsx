import './ScrollDots.css';

const sections = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'open-source', label: 'Open Source' },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function ScrollDots({ activeSection }: { activeSection: string }) {
  return (
    <nav className="scroll-dots" aria-label="Section navigation">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          className={`scroll-dots__dot${activeSection === section.id ? ' scroll-dots__dot--active' : ''}`}
          aria-label={section.label}
          aria-current={activeSection === section.id}
          onClick={() => scrollToSection(section.id)}
        />
      ))}
    </nav>
  );
}
