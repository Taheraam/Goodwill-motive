import { create } from 'zustand';
import api from '@/lib/api';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  contributionScore: number;
  streakCount: number;
  longestStreak: number;
  reputationScore: number;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  loginWithGoogle: () => void;
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

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
    set({ user, accessToken: token, isAuthenticated: true, error: null });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    set({ user: null, accessToken: null, isAuthenticated: false, error: null });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      get().setAuth(data.user, data.tokens.accessToken);
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
      get().setAuth(data.user, data.tokens.accessToken);
      toast.success(`Welcome to Goodwill Motive, ${data.user.username}!`);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Signup failed';
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  loginWithGoogle: () => {
    set({ error: 'OAuth not configured yet' });
  },

  fetchMe: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
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