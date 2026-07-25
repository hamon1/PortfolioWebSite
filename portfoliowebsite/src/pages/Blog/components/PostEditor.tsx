import { useState } from 'react';
import { Post, PostRequest, TagItem, TagType } from '../../../api/blog.api';
import '../../../styles/blog.css';

interface PostEditorProps {
  initial?: Post;
  onSubmit: (req: PostRequest) => Promise<void>;
  onCancel: () => void;
}

function PostEditor({ initial, onSubmit, onCancel }: PostEditorProps) {
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

  const toSlug = (t: string) =>
    t.toLowerCase()
      .replace(/[^\w가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!initial) setSlug(toSlug(v));
  };

  const addTag = () => {
    const name = tagInput.trim();
    if (!name || tags.some(t => t.name === name)) return;
    setTags(prev => [...prev, { name, type: tagType }]);
    setTagInput('');
  };

  const removeTag = (name: string) =>
    setTags(prev => prev.filter(t => t.name !== name));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        slug,
        title,
        content,
        date,
        projectRef: projectRef.trim() || null,
        tags,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="editor-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="editor-modal">
        <div className="editor-modal-header">
          <h2>{initial ? '포스트 수정' : '새 글 작성'}</h2>
          <button className="editor-close-btn" onClick={onCancel}>✕</button>
        </div>

        <form className="post-editor-form" onSubmit={handleSubmit}>
          <div className="editor-field">
            <label htmlFor="post-title">제목 *</label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="포스트 제목"
              autoFocus
              required
            />
          </div>

          <div className="editor-field-row">
            <div className="editor-field">
              <label htmlFor="post-slug">Slug *</label>
              <input
                id="post-slug"
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="url-friendly-slug"
                required
              />
            </div>
            <div className="editor-field">
              <label htmlFor="post-date">날짜 *</label>
              <input
                id="post-date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="editor-field">
            <label htmlFor="post-project-ref">프로젝트 연결 (선택)</label>
            <input
              id="post-project-ref"
              type="text"
              value={projectRef}
              onChange={e => setProjectRef(e.target.value)}
              placeholder="프로젝트 slug"
            />
          </div>

          <div className="editor-field">
            <label>태그</label>
            <div className="tag-input-row">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); addTag(); }
                }}
                placeholder="태그 이름 입력"
              />
              <select
                value={tagType}
                onChange={e => setTagType(e.target.value as TagType)}
              >
                <option value="GENERAL">일반</option>
                <option value="PROJECT">프로젝트</option>
              </select>
              <button type="button" className="btn-outline" onClick={addTag}>추가</button>
            </div>
            {tags.length > 0 && (
              <div className="blog-post-tags" style={{ marginTop: 8 }}>
                {tags.map(t => (
                  <span
                    key={t.name}
                    className={`tag-pill tag-pill--${t.type.toLowerCase()} tag-pill--removable`}
                  >
                    {t.name}
                    <button type="button" onClick={() => removeTag(t.name)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="editor-field">
            <label htmlFor="post-content">내용 (Markdown)</label>
            <textarea
              id="post-content"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="# 제목&#10;&#10;Markdown으로 작성하세요..."
              rows={18}
            />
          </div>

          {error && <p className="editor-error">{error}</p>}

          <div className="editor-actions">
            <button type="button" className="btn-outline" onClick={onCancel}>취소</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? '저장 중...' : initial ? '수정 완료' : '발행'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostEditor;
