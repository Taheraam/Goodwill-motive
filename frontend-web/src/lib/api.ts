import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

type TokenKeys = { access: string; refresh: string };

const storage = {
  get: (key: string) => (typeof window !== 'undefined' ? localStorage.getItem(key) : null),
  set: (key: string, value: string) => typeof window !== 'undefined' && localStorage.setItem(key, value),
  remove: (key: string) => typeof window !== 'undefined' && localStorage.removeItem(key),
};

/**
 * Axios client that attaches the access token and, on a 401, transparently swaps the
 * refresh token for a new pair and retries once. Concurrent 401s share one refresh call.
 * Before this, access tokens expired after 15 minutes and users were silently logged out.
 */
function createClient(keys: TokenKeys): AxiosInstance {
  const client = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });
  let refreshing: Promise<string | null> | null = null;

  const refresh = async (): Promise<string | null> => {
    const refreshToken = storage.get(keys.refresh);
    if (!refreshToken) return null;
    try {
      const { data } = await axios.post(`${API_URL}/auth/refresh`, { token: refreshToken });
      storage.set(keys.access, data.tokens.accessToken);
      storage.set(keys.refresh, data.tokens.refreshToken);
      return data.tokens.accessToken as string;
    } catch {
      storage.remove(keys.access);
      storage.remove(keys.refresh);
      return null;
    }
  };

  client.interceptors.request.use((config) => {
    const token = storage.get(keys.access);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
      const isAuthCall = original?.url?.startsWith('/auth/');
      if (error.response?.status !== 401 || !original || original._retried || isAuthCall) {
        return Promise.reject(error);
      }
      original._retried = true;
      refreshing ??= refresh().finally(() => (refreshing = null));
      const newToken = await refreshing;
      if (!newToken) return Promise.reject(error);
      original.headers.Authorization = `Bearer ${newToken}`;
      return client(original);
    },
  );

  return client;
}

export const USER_TOKENS: TokenKeys = { access: 'accessToken', refresh: 'refreshToken' };
export const ADMIN_TOKENS: TokenKeys = { access: 'adminToken', refresh: 'adminRefreshToken' };

const api = createClient(USER_TOKENS);
export default api;
export const adminApi = createClient(ADMIN_TOKENS);

/** OAuth must be a full-page navigation so the API can set its state cookie. */
export function startOAuth(provider: 'google' | 'github') {
  window.location.href = `${API_URL}/auth/${provider}`;
}
