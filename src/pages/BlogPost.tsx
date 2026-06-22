import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { renderMarkdown } from '../lib/markdown';
import { getPostBySlug } from '../lib/posts';
import { useMarkdownEmbeds } from '../hooks/useMarkdownEmbeds';
import './BlogPost.css';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  const bodyRef = useRef<HTMLDivElement>(null);

  useMarkdownEmbeds(bodyRef, post?.content);

  if (!post) {
    return (
      <div className="blog-post">
        <Link to="/blog" className="blog-post__back">
          ← Back to Blog
        </Link>
        <p>Post not found.</p>
      </div>
    );
  }

  return (
    <div className="blog-post">
      <Link to="/blog" className="blog-post__back">
        ← Back to Blog
      </Link>
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
