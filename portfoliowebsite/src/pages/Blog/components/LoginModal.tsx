import { useState } from 'react';
import '../../../styles/blog.css';

interface LoginModalProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onClose: () => void;
}

function LoginModal({ onLogin, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onLogin(username, password);
      onClose();
    } catch {
      setError('인증에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="login-modal">
        <div className="editor-modal-header">
          <h2>관리자 로그인</h2>
          <button className="editor-close-btn" onClick={onClose}>✕</button>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="editor-field">
            <label htmlFor="admin-username">Username</label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              required
            />
          </div>
          <div className="editor-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="editor-error">{error}</p>}
          <div className="editor-actions">
            <button type="button" className="btn-outline" onClick={onClose}>취소</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '...' : '로그인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
