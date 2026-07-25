import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogApi } from '../../api/blog.api';
import type { PostRequest, TagItem, TagType } from '../../api/blog.api';
import { useBlogAuth } from '../../hooks/useBlogAuth';
import '../../styles/adminWrite.css';

const SESSION_KEY = 'blog_admin_token';

// ── Write form ───────────────────────────────────────────────────

interface WriteFormProps {
  token: string;
  onSaved: () => void;
}

function WriteForm({ token, onSaved }: WriteFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [date, setDate] = useState(today);
  const [content, setContent] = useState('');
  const [projectRef, setProjectRef] = useState('');
  const [tags, setTags] = useState<TagItem[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tagType, setTagType] = useState<TagType>('GENERAL');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      await blogApi.create(req, token);
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
          onChange={e => { setTitle(e.target.value); setSlug(toSlug(e.target.value)); }}
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
        <button type="submit" className="aw-btn-publish" disabled={submitting}>
          {submitting ? '저장 중...' : '발행하기'}
        </button>
      </div>
    </form>
  );
}

// ── Saved confirmation ───────────────────────────────────────────

interface SavedConfirmProps {
  onNew: () => void;
  onBack: () => void;
}

function SavedConfirm({ onNew, onBack }: SavedConfirmProps) {
  return (
    <div className="aw-saved">
      <p className="aw-saved-check">✓</p>
      <p className="aw-saved-msg">발행 완료</p>
      <div className="aw-saved-actions">
        <button className="aw-btn-outline" onClick={onNew}>새 글 작성</button>
        <button className="aw-btn-publish" onClick={onBack}>블로그로 돌아가기</button>
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
  const [saved, setSaved] = useState(false);

  // Logout on navigation away (unmount) and tab close
  useEffect(() => {
    const clear = () => sessionStorage.removeItem(SESSION_KEY);
    window.addEventListener('beforeunload', clear);
    return () => {
      window.removeEventListener('beforeunload', clear);
      clear();
    };
  }, []);

  const handleBack = () => navigate('/blog');

  if (!isAdmin) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <div className="aw-root">
      <header className="aw-topbar">
        <button className="aw-nav-btn" onClick={handleBack}>← 블로그</button>
        <span className="aw-topbar-title">새 글 작성</span>
        <button className="aw-nav-btn aw-nav-btn--logout" onClick={handleBack}>
          로그아웃
        </button>
      </header>
      <main className="aw-main">
        {saved
          ? <SavedConfirm onNew={() => setSaved(false)} onBack={handleBack} />
          : <WriteForm token={token!} onSaved={() => setSaved(true)} />
        }
      </main>
    </div>
  );
}

export default AdminWrite;
