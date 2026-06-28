import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getWikiPageBySlug, getWikiSections } from '../lib/wiki';
import { WikiDrawerContext } from '../hooks/wikiDrawerContext';
import { useTranslation } from '../hooks/useTranslation';
import { useLocalizedPath } from '../hooks/useLocalizedPath';
import './WikiLayout.css';

function WikiSidebarNav({
  onNavigate,
  activeSlug,
}: {
  onNavigate?: () => void;
  activeSlug?: string;
}) {
  const { t, locale } = useTranslation();
  const lp = useLocalizedPath();
  const sections = getWikiSections(locale);

  return (
    <nav className="wiki-sidebar__nav" aria-label="Wiki handbook">
      <a
        href={lp('/wiki')}
        className={`wiki-sidebar__home${activeSlug ? '' : ' wiki-sidebar__home--active'}`}
        onClick={onNavigate}
      >
        {t.wiki.heading}
      </a>
      {sections.map((section) => (
        <div className="wiki-sidebar__section" key={section.id}>
          <p className="wiki-sidebar__section-title">{section.title}</p>
          <ul className="wiki-sidebar__pages">
            {section.pages.map((page) => (
              <li key={page.slug}>
                <a
                  href={lp(`/wiki/${page.slug}`)}
                  className={`wiki-sidebar__link${activeSlug === page.slug ? ' wiki-sidebar__link--active' : ''}`}
                  aria-current={activeSlug === page.slug ? 'page' : undefined}
                  onClick={onNavigate}
                >
                  {page.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function WikiShell({
  children,
  activeSlug,
}: {
  children: ReactNode;
  activeSlug?: string;
}) {
  const { t, locale } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const drawerContext = useMemo(() => ({ closeDrawer }), [closeDrawer]);

  const activePage = activeSlug ? getWikiPageBySlug(activeSlug, locale) : undefined;
  const subBarTitle = activePage?.title ?? t.wiki.heading;

  useEffect(() => {
    if (!drawerOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setDrawerOpen(false);
    }

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [drawerOpen]);

  return (
    <WikiDrawerContext value={drawerContext}>
      <div className="wiki-layout">
        <div className="wiki-layout__mobile-bar">
          <button
            type="button"
            className="wiki-layout__contents-btn"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((open) => !open)}
          >
            {t.wiki.contents}
          </button>
          <span className="wiki-layout__mobile-title">{subBarTitle}</span>
        </div>

        {drawerOpen && (
          <button
            type="button"
            className="wiki-layout__backdrop"
            aria-label="Close contents"
            onClick={closeDrawer}
          />
        )}

        <aside className={`wiki-layout__sidebar${drawerOpen ? ' wiki-layout__sidebar--open' : ''}`}>
          <WikiSidebarNav activeSlug={activeSlug} onNavigate={closeDrawer} />
        </aside>

        <div className="wiki-layout__main">{children}</div>
      </div>
    </WikiDrawerContext>
  );
}
