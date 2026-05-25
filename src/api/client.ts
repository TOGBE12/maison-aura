const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ApiError {
  status: number;
  message: string;
  data?: unknown;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('mv_luxury_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: response.statusText,
    };
    try {
      error.data = await response.json();
      const d = error.data as Record<string, unknown>;
      if (d?.message && typeof d.message === 'string') {
        error.message = d.message;
      } else if (d?.errors && typeof d.errors === 'object') {
        const firstErr = Object.values(d.errors as Record<string, string[]>).find(Boolean);
        if (firstErr && Array.isArray(firstErr) && firstErr.length > 0) {
          error.message = firstErr[0];
        }
      }
    } catch {}
    throw error;
  }

  return response.json();
}

export function get<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: 'GET' });
}

export function post<T>(endpoint: string, data?: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export function put<T>(endpoint: string, data?: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export function del<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: 'DELETE' });
}

export interface LoginResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    created_at: string;
  };
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    created_at: string;
  };
  token: string;
}

export function loginUser(email: string, password: string): Promise<LoginResponse> {
  return post<LoginResponse>('/auth/login', { email, password });
}

export function registerUser(name: string, email: string, password: string): Promise<RegisterResponse> {
  return post<RegisterResponse>('/auth/register', {
    name,
    email,
    password,
    password_confirmation: password,
  });
}

export default { get, post, put, del };
