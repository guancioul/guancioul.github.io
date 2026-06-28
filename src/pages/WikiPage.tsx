import { useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { renderWikiMarkdown } from '../lib/markdown';
import { getAdjacentWikiPages, getWikiPageBySlug } from '../lib/wiki';
import { useMarkdownEmbeds } from '../hooks/useMarkdownEmbeds';
import { useWikiDrawer } from '../hooks/wikiDrawerContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useTranslation } from '../hooks/useTranslation';
import './WikiPage.css';

function scrollToHeading(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function WikiPage() {
  const { t, locale } = useTranslation();
  const { closeDrawer } = useWikiDrawer();
  const { slug } = useParams<{ slug: string }>();
  const page = slug ? getWikiPageBySlug(slug, locale) : undefined;
  const adjacent = slug ? getAdjacentWikiPages(slug, locale) : { prev: null, next: null };

  useDocumentTitle(page?.title ?? (slug ? t.wiki.notFound : t.wiki.heading), t.common.name);
  const bodyRef = useRef<HTMLDivElement>(null);

  const rendered = useMemo(
    () => (page ? renderWikiMarkdown(page.content) : { html: '', headings: [] }),
    [page],
  );

  useMarkdownEmbeds(bodyRef, page?.content);

  if (!page) {
    return (
      <div className="wiki-article">
        <Link to="/wiki" className="wiki-article__back">
          {t.common.backTo(t.nav.wiki)}
        </Link>
        <p>{t.wiki.notFound}</p>
      </div>
    );
  }

  const showToc = rendered.headings.length > 0;

  return (
    <div className={`wiki-article-layout${showToc ? ' wiki-article-layout--with-toc' : ''}`}>
      <article className="wiki-article">
        <p className="wiki-article__section mono">{page.sectionTitle}</p>
        <h1 className="wiki-article__title">{page.title}</h1>
        {page.updatedAt && (
          <p className="wiki-article__updated mono">{t.wiki.updatedAt(page.updatedAt)}</p>
        )}
        <div
          ref={bodyRef}
          className="wiki-article__body"
          dangerouslySetInnerHTML={{ __html: rendered.html }}
        />
        {(adjacent.prev || adjacent.next) && (
          <nav className="wiki-article__pager" aria-label="Wiki page navigation">
            {adjacent.prev ? (
              <Link
                to={`/wiki/${adjacent.prev.slug}`}
                className="wiki-article__pager-link wiki-article__pager-link--prev"
                onClick={closeDrawer}
              >
                <span className="wiki-article__pager-label mono">{t.wiki.prev}</span>
                <span className="wiki-article__pager-title">{adjacent.prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {adjacent.next ? (
              <Link
                to={`/wiki/${adjacent.next.slug}`}
                className="wiki-article__pager-link wiki-article__pager-link--next"
                onClick={closeDrawer}
              >
                <span className="wiki-article__pager-label mono">{t.wiki.next}</span>
                <span className="wiki-article__pager-title">{adjacent.next.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </article>

      {showToc && (
        <div className="wiki-toc-wrap">
          <aside className="wiki-toc" aria-label={t.wiki.onThisPage}>
            <p className="wiki-toc__title">{t.wiki.onThisPage}</p>
            <nav className="wiki-toc__nav">
              <ul className="wiki-toc__list">
                {rendered.headings.map((heading) => (
                  <li
                    key={heading.id}
                    className={`wiki-toc__item${heading.level === 3 ? ' wiki-toc__item--sub' : ''}`}
                  >
                    <button
                      type="button"
                      className="wiki-toc__link"
                      onClick={() => scrollToHeading(heading.id)}
                    >
                      {heading.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
