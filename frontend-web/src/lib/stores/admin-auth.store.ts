import { create } from 'zustand';
import api, { ADMIN_TOKENS } from '@/lib/api';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  contributionScore: number;
  streakCount: number;
  longestStreak: number;
  reputationScore: number;
}

interface AdminAuthState {
  admin: AdminUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  admin: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.user?.role !== 'admin') {
        set({ error: 'Access denied. Admin credentials required.' });
        return;
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_TOKENS.access, data.tokens.accessToken);
        localStorage.setItem(ADMIN_TOKENS.refresh, data.tokens.refreshToken);
      }
      set({ admin: data.user, accessToken: data.tokens.accessToken, isAuthenticated: true, error: null });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Admin login failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ADMIN_TOKENS.access);
      localStorage.removeItem(ADMIN_TOKENS.refresh);
    }
    set({ admin: null, accessToken: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
