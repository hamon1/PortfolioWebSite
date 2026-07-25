const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export type TagType = 'GENERAL' | 'PROJECT';

export interface TagItem {
  name: string;
  type: TagType;
}

export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  date: string;
  projectRef: string | null;
  tags: TagItem[];
}

export interface Post extends PostSummary {
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostsPage {
  content: PostSummary[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface PostRequest {
  slug: string;
  title: string;
  content: string;
  date: string;
  projectRef?: string | null;
  tags: Array<{ name: string; type: TagType }>;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { headers: initHeaders, ...restInit } = init ?? {};
  const res = await fetch(`${BASE}${path}`, {
    ...restInit,
    headers: { 'Content-Type': 'application/json', ...initHeaders },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json.data as T;
}

export const blogApi = {
  list(page = 0, size = 10, tag?: string): Promise<PostsPage> {
    const q = new URLSearchParams({ page: String(page), size: String(size) });
    if (tag) q.set('tag', tag);
    return apiFetch(`/api/posts?${q}`);
  },

  getBySlug(slug: string): Promise<Post> {
    return apiFetch(`/api/posts/${slug}`);
  },

  async login(username: string, password: string): Promise<string> {
    const data = await apiFetch<{ token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    return data.token;
  },

  create(req: PostRequest, token: string): Promise<Post> {
    return apiFetch('/api/admin/posts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(req),
    });
  },

  update(id: string, req: PostRequest, token: string): Promise<Post> {
    return apiFetch(`/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(req),
    });
  },

  delete(id: string, token: string): Promise<void> {
    return apiFetch(`/api/admin/posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
