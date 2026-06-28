import { useRef } from 'react';
import { renderMarkdown } from '../lib/markdown';
import { getPostBySlug } from '../lib/posts';
import { useMarkdownEmbeds } from '../hooks/useMarkdownEmbeds';
import { useTranslation } from '../hooks/useTranslation';
import './BlogPost.css';

export function BlogPost({ slug }: { slug: string }) {
  const { t, locale } = useTranslation();
  const post = getPostBySlug(slug, locale);
  const bodyRef = useRef<HTMLDivElement>(null);

  useMarkdownEmbeds(bodyRef, post?.content);

  if (!post) {
    return (
      <div className="blog-post">
        <a href="/blog" className="blog-post__back">
          {t.common.backTo(t.nav.blog)}
        </a>
        <p>{t.blog.notFound}</p>
      </div>
    );
  }

  return (
    <div className="blog-post">
      <a href="/blog" className="blog-post__back">
        {t.common.backTo(t.nav.blog)}
      </a>
      <h1 className="blog-post__title">{post.title}</h1>
      <div className="blog-post__meta">
        <span className="blog-post__date mono">{post.date}</span>
        {post.tags.length > 0 && (
          <div className="blog-post__tags">
            {post.tags.map((tag) => (
              <span className="blog-post__tag mono" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div
        ref={bodyRef}
        className="blog-post__body"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
      />
    </div>
  );
}
