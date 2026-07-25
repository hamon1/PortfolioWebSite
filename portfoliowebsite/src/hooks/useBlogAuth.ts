import { useState, useCallback } from 'react';
import { blogApi } from '../api/blog.api';

const TOKEN_KEY = 'blog_admin_token';

export function useBlogAuth() {
  const [token, setToken] = useState<string | null>(
    () => sessionStorage.getItem(TOKEN_KEY)
  );

  const login = useCallback(async (username: string, password: string) => {
    const t = await blogApi.login(username, password);
    sessionStorage.setItem(TOKEN_KEY, t);
    setToken(t);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  return { token, isAdmin: !!token, login, logout };
}
