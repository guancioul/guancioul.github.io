import { Link } from 'react-router-dom';
import { getWikiHandbookMeta, getWikiSections } from '../lib/wiki';
import { useWikiDrawer } from '../hooks/wikiDrawerContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useTranslation } from '../hooks/useTranslation';
import './WikiHome.css';

export function WikiHome() {
  const { t, locale } = useTranslation();
  const { closeDrawer } = useWikiDrawer();
  const meta = getWikiHandbookMeta(locale);
  const sections = getWikiSections(locale);

  useDocumentTitle(meta.title || t.wiki.heading, t.common.name);

  return (
    <div className="wiki-home">
      <h1 className="wiki-home__title">{meta.title || t.wiki.heading}</h1>
      <p className="wiki-home__intro">{meta.intro || t.wiki.intro}</p>

      {sections.length === 0 ? (
        <p className="wiki-home__empty">{t.wiki.empty}</p>
      ) : (
        <div className="wiki-home__sections">
          {sections.map((section) => (
            <section className="wiki-home__section" key={section.id}>
              <h2 className="wiki-home__section-title">{section.title}</h2>
              <ul className="wiki-home__pages">
                {section.pages.map((page) => (
                  <li className="wiki-home__page" key={page.slug}>
                    <Link to={`/wiki/${page.slug}`} className="wiki-home__page-link" onClick={closeDrawer}>
                      {page.title}
                    </Link>
                    {page.summary && <p className="wiki-home__page-summary">{page.summary}</p>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
