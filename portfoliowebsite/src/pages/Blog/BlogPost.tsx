import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { blogApi } from '../../api/blog.api';
import type { Post } from '../../api/blog.api';
import '../../styles/blog.css';

function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);

    blogApi.getBySlug(slug)
      .then(data => { if (!cancelled) { setPost(data); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e instanceof Error ? e.message : '포스트를 찾을 수 없습니다.'); setLoading(false); } });

    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="blog-state-box" style={{ padding: '80px 0' }}>
        <div className="blog-spinner" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-error-page">
        <p>{error ?? '포스트를 찾을 수 없습니다.'}</p>
        <Link to="/blog">← 목록으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <article className="blog-post-detail">
      <div className="back-navigation">
        <Link to="/blog">← Blog</Link>
      </div>

      <header className="blog-post-hero">
        <time className="blog-post-date">{post.date}</time>
        <h1>{post.title}</h1>
        {post.tags.length > 0 && (
          <div className="blog-post-tags">
            {post.tags.map(t => (
              <span
                key={t.name}
                className={`tag-pill tag-pill--${t.type.toLowerCase()}`}
              >
                {t.name}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="blog-post-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}

export default BlogPost;
