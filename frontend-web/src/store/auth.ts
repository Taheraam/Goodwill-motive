import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Note: In a real Monorepo setup using Turborepo or npm workspaces properly built, 
// we would import this from '@goodwill/shared'. For now we redefine it here 
// since Next.js might not compile the external workspace without next-transpile-modules.
interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  contributionScore: number;
  streakCount: number;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, accessToken: token, isAuthenticated: true }),
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);