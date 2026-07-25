import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogApi } from '../../api/blog.api';
import type { PostSummary, TagItem } from '../../api/blog.api';
import '../../styles/blog.css';

function Blog() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [tagFilter, setTagFilter] = useState<string | undefined>();
  const [allTags, setAllTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    blogApi.list(page, 10, tagFilter)
      .then(data => {
        if (cancelled) return;
        setPosts(data.content);
        setTotalPages(data.totalPages);
        const tagMap = new Map<string, TagItem>();
        data.content.forEach(p => p.tags.forEach(t => tagMap.set(t.name, t)));
        setAllTags(Array.from(tagMap.values()));
        setLoading(false);
      })
      .catch(e => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : '포스트를 불러올 수 없습니다.');
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [page, tagFilter]);

  return (
    <section className="blog-section">
      <div className="blog-page-header">
        <div>
          <span className="section-label">Dev Log</span>
          <h1>Blog</h1>
          <p className="blog-subtitle">개발 과정, 트러블슈팅, 학습 기록</p>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="blog-tag-filter">
          <button
            className={`tag-filter-btn${!tagFilter ? ' active' : ''}`}
            onClick={() => { setTagFilter(undefined); setPage(0); }}
          >
            전체
          </button>
          {allTags.map(t => (
            <button
              key={t.name}
              className={`tag-filter-btn${tagFilter === t.name ? ' active' : ''}`}
              onClick={() => { setTagFilter(t.name); setPage(0); }}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="blog-state-box">
          <div className="blog-spinner" />
          <span>불러오는 중...</span>
        </div>
      ) : error ? (
        <div className="blog-state-box blog-state-box--error">
          <p>백엔드 서버에 연결할 수 없습니다.</p>
          <span>{error}</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="blog-state-box">
          <p>아직 작성된 글이 없습니다.</p>
        </div>
      ) : (
        <ul className="blog-list">
          {posts.map(post => (
            <li key={post.id} className="blog-post-card">
              <div className="blog-post-card-meta">
                <time className="blog-post-date">{post.date}</time>
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
              </div>
              <Link to={`/blog/${post.slug}`} className="blog-post-card-title">
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="blog-pagination">
          <button
            className="btn-outline"
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
          >
            ← 이전
          </button>
          <span className="blog-pagination-info">{page + 1} / {totalPages}</span>
          <button
            className="btn-outline"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
          >
            다음 →
          </button>
        </div>
      )}
    </section>
  );
}

export default Blog;
