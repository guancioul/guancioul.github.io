import { useState } from 'react';
import { getAllPosts } from '../lib/posts';
import { useTranslation } from '../hooks/useTranslation';
import './BlogList.css';

const PER_PAGE = 5;

export function BlogList() {
  const { t, locale } = useTranslation();
  const posts = getAllPosts(locale);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(posts.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const pageItems = posts.slice(start, start + PER_PAGE);

  return (
    <div className="blog-list">
      <h1>{t.blog.heading}</h1>

      {posts.length === 0 ? (
        <p className="blog-list__empty">{t.blog.empty}</p>
      ) : (
        <div className="blog-list__items">
          {pageItems.map((post) => (
            <article className="blog-list__item" key={post.slug}>
              <div className="blog-list__item-header">
                <a href={`/blog/${post.slug}`} className="blog-list__item-title">
                  {post.title}
                </a>
                <span className="blog-list__item-date mono">{post.date}</span>
              </div>
              {post.tags.length > 0 && (
                <div className="blog-list__item-tags">
                  {post.tags.map((tag) => (
                    <span className="blog-list__tag mono" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="blog-list__item-summary">{post.summary}</p>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="blog-list__pagination">
          <button
            type="button"
            className="blog-list__page-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            &#8592; {t.blog.prev}
          </button>
          <span className="blog-list__page-info mono">
            {t.blog.pageOf(page, totalPages)}
          </span>
          <button
            type="button"
            className="blog-list__page-btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            {t.blog.next} &#8594;
          </button>
        </div>
      )}
    </div>
  );
}
