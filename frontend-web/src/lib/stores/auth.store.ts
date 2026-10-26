import { create } from 'zustand';
import api, { USER_TOKENS } from '@/lib/api';
import { toast } from 'sonner';
import { UserProfile } from '@/types/shared';

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setAuth: (user: UserProfile, token: string, refreshToken?: string) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  fetchMe: () => Promise<void>;
  clearError: () => void;
  setError: (error: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setAuth: (user, token, refreshToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_TOKENS.access, token);
      if (refreshToken) localStorage.setItem(USER_TOKENS.refresh, refreshToken);
    }
    set({ user, accessToken: token, isAuthenticated: true, error: null });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_TOKENS.access);
      localStorage.removeItem(USER_TOKENS.refresh);
    }
    set({ user: null, accessToken: null, isAuthenticated: false, error: null });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      get().setAuth(data.user, data.tokens.accessToken, data.tokens.refreshToken);
      toast.success(`Welcome back, ${data.user.username}!`);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed';
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (email, password, username) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/signup', { email, password, username });
      get().setAuth(data.user, data.tokens.accessToken, data.tokens.refreshToken);
      toast.success(`Welcome to Goodwill Motive, ${data.user.username}!`);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Signup failed';
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMe: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(USER_TOKENS.access) : null;
    if (!token) return;
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data, isAuthenticated: true, accessToken: token });
    } catch {
      get().logout();
    }
  },

  clearError: () => set({ error: null }),
  setError: (error: string) => set({ error }),
}));