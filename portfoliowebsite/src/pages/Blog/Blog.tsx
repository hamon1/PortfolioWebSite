import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogApi, PostSummary, TagItem, PostRequest } from '../../api/blog.api';
import { useBlogAuth } from '../../hooks/useBlogAuth';
import PostEditor from './components/PostEditor';
import LoginModal from './components/LoginModal';
import '../../styles/blog.css';

function Blog() {
  const { token, isAdmin, login, logout } = useBlogAuth();
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [tagFilter, setTagFilter] = useState<string | undefined>();
  const [allTags, setAllTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

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

  const handleCreate = async (req: PostRequest) => {
    if (!token) return;
    await blogApi.create(req, token);
    setShowEditor(false);
    setPage(0);
    setTagFilter(undefined);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!token) return;
    if (!window.confirm(`"${title}" 포스트를 삭제하시겠습니까?`)) return;
    try {
      await blogApi.delete(id, token);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : '삭제에 실패했습니다.');
    }
  };

  return (
    <section className="blog-section">
      <div className="blog-page-header">
        <div>
          <span className="section-label">Dev Log</span>
          <h1>Blog</h1>
          <p className="blog-subtitle">개발 과정, 트러블슈팅, 학습 기록</p>
        </div>
        {isAdmin && (
          <div className="blog-admin-controls">
            <button className="btn-primary" onClick={() => setShowEditor(true)}>
              + 새 글 작성
            </button>
            <button className="btn-outline" onClick={logout}>로그아웃</button>
          </div>
        )}
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
          {isAdmin && (
            <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setShowEditor(true)}>
              첫 번째 글 작성하기
            </button>
          )}
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
              {isAdmin && (
                <button
                  className="blog-post-delete-btn"
                  onClick={() => handleDelete(post.id, post.title)}
                >
                  삭제
                </button>
              )}
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

      {!isAdmin && (
        <button
          className="admin-fab"
          onClick={() => setShowLogin(true)}
          title="관리자 로그인"
        >
          관리자
        </button>
      )}

      {showLogin && (
        <LoginModal onLogin={login} onClose={() => setShowLogin(false)} />
      )}

      {showEditor && (
        <PostEditor onSubmit={handleCreate} onCancel={() => setShowEditor(false)} />
      )}
    </section>
  );
}

export default Blog;
