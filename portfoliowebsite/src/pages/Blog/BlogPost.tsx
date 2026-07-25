import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { blogApi, Post, PostRequest } from '../../api/blog.api';
import { useBlogAuth } from '../../hooks/useBlogAuth';
import PostEditor from './components/PostEditor';
import '../../styles/blog.css';

function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { token, isAdmin } = useBlogAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);

    blogApi.getBySlug(slug)
      .then(data => { if (!cancelled) { setPost(data); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e instanceof Error ? e.message : '포스트를 찾을 수 없습니다.'); setLoading(false); } });

    return () => { cancelled = true; };
  }, [slug]);

  const handleUpdate = async (req: PostRequest) => {
    if (!post || !token) return;
    const updated = await blogApi.update(post.id, req, token);
    setPost(updated);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!post || !token) return;
    if (!window.confirm(`"${post.title}" 포스트를 삭제하시겠습니까?`)) return;
    setDeleteLoading(true);
    try {
      await blogApi.delete(post.id, token);
      navigate('/blog');
    } catch (e) {
      alert(e instanceof Error ? e.message : '삭제에 실패했습니다.');
      setDeleteLoading(false);
    }
  };

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
        {isAdmin && (
          <div className="admin-post-controls">
            <button className="btn-outline" onClick={() => setEditing(true)}>수정</button>
            <button
              className="btn-danger"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? '삭제 중...' : '삭제'}
            </button>
          </div>
        )}
      </header>

      <div className="blog-post-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      {editing && (
        <PostEditor
          initial={post}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      )}
    </article>
  );
}

export default BlogPost;
