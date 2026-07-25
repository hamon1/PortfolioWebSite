import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogApi } from '../../api/blog.api';
import type { Post, PostSummary, PostRequest, TagItem, TagType } from '../../api/blog.api';
import { useBlogAuth } from '../../hooks/useBlogAuth';
import '../../styles/adminWrite.css';

const SESSION_KEY = 'blog_admin_token';

type Mode =
  | { type: 'list' }
  | { type: 'create' }
  | { type: 'edit'; post: Post };

// ── Post list ────────────────────────────────────────────────────

interface PostListProps {
  token: string;
  onEdit: (post: Post) => void;
  onNew: () => void;
}

function PostList({ token, onEdit, onNew }: PostListProps) {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEdit, setLoadingEdit] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPosts = useCallback((p: number) => {
    setLoading(true);
    setError(null);
    blogApi.list(p, 20)
      .then(data => {
        setPosts(data.content);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch(e => {
        setError(e instanceof Error ? e.message : '불러오기 실패');
        setLoading(false);
      });
  }, []);

  useEffect(() => { fetchPosts(page); }, [fetchPosts, page]);

  const handleEdit = async (post: PostSummary) => {
    setLoadingEdit(post.id);
    try {
      const full = await blogApi.getBySlug(post.slug);
      onEdit(full);
    } catch (e) {
      alert(e instanceof Error ? e.message : '포스트를 불러올 수 없습니다.');
    } finally {
      setLoadingEdit(null);
    }
  };

  const handleDelete = async (post: PostSummary) => {
    if (!window.confirm(`"${post.title}" 포스트를 삭제하시겠습니까?`)) return;
    try {
      await blogApi.delete(post.id, token);
      setPosts(prev => prev.filter(p => p.id !== post.id));
    } catch (e) {
      alert(e instanceof Error ? e.message : '삭제에 실패했습니다.');
    }
  };

  return (
    <div className="aw-list-root">
      <div className="aw-list-header">
        <span className="aw-list-count">
          {loading ? '...' : `${posts.length}개의 포스트`}
        </span>
        <button className="aw-btn-publish" onClick={onNew}>+ 새 글 작성</button>
      </div>

      {loading ? (
        <div className="aw-state-box"><div className="aw-spinner" /></div>
      ) : error ? (
        <div className="aw-state-box aw-state-box--error">{error}</div>
      ) : posts.length === 0 ? (
        <div className="aw-state-box">아직 작성된 글이 없습니다.</div>
      ) : (
        <ul className="aw-post-list">
          {posts.map(post => (
            <li key={post.id} className="aw-post-item">
              <div className="aw-post-item-info">
                <time className="aw-post-item-date">{post.date}</time>
                <span className="aw-post-item-title">{post.title}</span>
                {post.tags.length > 0 && (
                  <div className="aw-post-item-tags">
                    {post.tags.map(t => (
                      <span key={t.name} className={`aw-tag-pill aw-tag-pill--${t.type.toLowerCase()}`}>
                        {t.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="aw-post-item-actions">
                <button
                  className="aw-btn-edit"
                  onClick={() => handleEdit(post)}
                  disabled={loadingEdit === post.id}
                >
                  {loadingEdit === post.id ? '...' : '수정'}
                </button>
                <button
                  className="aw-btn-delete"
                  onClick={() => handleDelete(post)}
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="aw-list-pagination">
          <button className="aw-btn-outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            ← 이전
          </button>
          <span className="aw-pagination-info">{page + 1} / {totalPages}</span>
          <button className="aw-btn-outline" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
            다음 →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Write / Edit form ────────────────────────────────────────────

interface WriteFormProps {
  token: string;
  initial?: Post;
  onSaved: () => void;
  onCancel: () => void;
}

function WriteForm({ token, initial, onSaved, onCancel }: WriteFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [date, setDate] = useState(initial?.date ?? today);
  const [content, setContent] = useState(initial?.content ?? '');
  const [projectRef, setProjectRef] = useState(initial?.projectRef ?? '');
  const [tags, setTags] = useState<TagItem[]>(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [tagType, setTagType] = useState<TagType>('GENERAL');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initial;

  const toSlug = (t: string) =>
    t.toLowerCase()
      .replace(/[^\w가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const addTag = () => {
    const name = tagInput.trim();
    if (!name || tags.some(t => t.name === name)) return;
    setTags(prev => [...prev, { name, type: tagType }]);
    setTagInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const req: PostRequest = {
        slug,
        title,
        content,
        date,
        projectRef: projectRef.trim() || null,
        tags,
      };
      if (isEdit) {
        await blogApi.update(initial.id, req, token);
      } else {
        await blogApi.create(req, token);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="aw-form" onSubmit={handleSubmit}>
      <div className="aw-field">
        <label htmlFor="aw-title">제목</label>
        <input
          id="aw-title"
          type="text"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            if (!isEdit) setSlug(toSlug(e.target.value));
          }}
          placeholder="포스트 제목"
          autoFocus
          required
        />
      </div>

      <div className="aw-field-row">
        <div className="aw-field">
          <label htmlFor="aw-slug">Slug</label>
          <input
            id="aw-slug"
            type="text"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            placeholder="url-friendly-slug"
            required
          />
        </div>
        <div className="aw-field">
          <label htmlFor="aw-date">날짜</label>
          <input
            id="aw-date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="aw-field">
        <label htmlFor="aw-project-ref">프로젝트 연결 (선택)</label>
        <input
          id="aw-project-ref"
          type="text"
          value={projectRef}
          onChange={e => setProjectRef(e.target.value)}
          placeholder="project-slug"
        />
      </div>

      <div className="aw-field">
        <label>태그</label>
        <div className="aw-tag-row">
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            placeholder="태그 이름"
          />
          <select value={tagType} onChange={e => setTagType(e.target.value as TagType)}>
            <option value="GENERAL">일반</option>
            <option value="PROJECT">프로젝트</option>
          </select>
          <button type="button" className="aw-tag-add-btn" onClick={addTag}>추가</button>
        </div>
        {tags.length > 0 && (
          <div className="aw-tag-list">
            {tags.map(t => (
              <span key={t.name} className={`aw-tag-pill aw-tag-pill--${t.type.toLowerCase()}`}>
                {t.name}
                <button
                  type="button"
                  onClick={() => setTags(prev => prev.filter(x => x.name !== t.name))}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="aw-field">
        <label htmlFor="aw-content">내용 (Markdown)</label>
        <textarea
          id="aw-content"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={'# 제목\n\nMarkdown으로 작성하세요...'}
          rows={26}
        />
      </div>

      {error && <p className="aw-error">{error}</p>}

      <div className="aw-form-footer">
        <button type="button" className="aw-btn-outline" onClick={onCancel}>
          ← 목록으로
        </button>
        <button type="submit" className="aw-btn-publish" disabled={submitting}>
          {submitting ? '저장 중...' : isEdit ? '수정 완료' : '발행하기'}
        </button>
      </div>
    </form>
  );
}

// ── Saved confirmation ───────────────────────────────────────────

interface SavedConfirmProps {
  isEdit: boolean;
  onNew: () => void;
  onList: () => void;
}

function SavedConfirm({ isEdit, onNew, onList }: SavedConfirmProps) {
  return (
    <div className="aw-saved">
      <p className="aw-saved-check">✓</p>
      <p className="aw-saved-msg">{isEdit ? '수정 완료' : '발행 완료'}</p>
      <div className="aw-saved-actions">
        {!isEdit && <button className="aw-btn-outline" onClick={onNew}>새 글 작성</button>}
        <button className="aw-btn-publish" onClick={onList}>목록으로</button>
      </div>
    </div>
  );
}

// ── Login screen ─────────────────────────────────────────────────

interface LoginScreenProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

function LoginScreen({ onLogin }: LoginScreenProps) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onLogin(form.username, form.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aw-login-screen">
      <div className="aw-login-card">
        <p className="aw-login-label">Admin</p>
        <form className="aw-login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="username"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            autoFocus
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            autoComplete="current-password"
          />
          {error && <p className="aw-login-error">{error}</p>}
          <button type="submit" className="aw-btn-publish" disabled={loading}>
            {loading ? '···' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Page root ────────────────────────────────────────────────────

function AdminWrite() {
  const navigate = useNavigate();
  const { token, isAdmin, login } = useBlogAuth();
  const [mode, setMode] = useState<Mode>({ type: 'list' });
  const [savedMode, setSavedMode] = useState<'create' | 'edit' | null>(null);

  useEffect(() => {
    const clear = () => sessionStorage.removeItem(SESSION_KEY);
    window.addEventListener('beforeunload', clear);
    return () => {
      window.removeEventListener('beforeunload', clear);
      clear();
    };
  }, []);

  const handleBack = useCallback(() => navigate('/blog'), [navigate]);
  const goList = useCallback(() => setMode({ type: 'list' }), []);

  const modeTitle =
    mode.type === 'create' ? '새 글 작성' :
    mode.type === 'edit'   ? '글 수정' :
                             '포스트 관리';

  if (!isAdmin) return <LoginScreen onLogin={login} />;

  if (savedMode) {
    return (
      <div className="aw-root">
        <header className="aw-topbar">
          <button className="aw-nav-btn" onClick={handleBack}>← 블로그</button>
          <span className="aw-topbar-title">Admin</span>
          <button className="aw-nav-btn aw-nav-btn--logout" onClick={handleBack}>로그아웃</button>
        </header>
        <main className="aw-main">
          <SavedConfirm
            isEdit={savedMode === 'edit'}
            onNew={() => { setSavedMode(null); setMode({ type: 'create' }); }}
            onList={() => { setSavedMode(null); goList(); }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="aw-root">
      <header className="aw-topbar">
        <button className="aw-nav-btn" onClick={mode.type === 'list' ? handleBack : goList}>
          {mode.type === 'list' ? '← 블로그' : '← 목록'}
        </button>
        <span className="aw-topbar-title">{modeTitle}</span>
        <button className="aw-nav-btn aw-nav-btn--logout" onClick={handleBack}>로그아웃</button>
      </header>
      <main className="aw-main">
        {mode.type === 'list' && (
          <PostList
            token={token!}
            onEdit={post => setMode({ type: 'edit', post })}
            onNew={() => setMode({ type: 'create' })}
          />
        )}
        {mode.type === 'create' && (
          <WriteForm
            token={token!}
            onSaved={() => setSavedMode('create')}
            onCancel={goList}
          />
        )}
        {mode.type === 'edit' && (
          <WriteForm
            token={token!}
            initial={mode.post}
            onSaved={() => setSavedMode('edit')}
            onCancel={goList}
          />
        )}
      </main>
    </div>
  );
}

export default AdminWrite;
