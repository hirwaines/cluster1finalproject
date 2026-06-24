import axios from 'axios';

export const BASE_URL =
  (import.meta as Record<string, unknown> & { env?: Record<string, string> }).env?.VITE_API_URL ??
  'http://localhost:8080/api/v1';

export const TOKEN_KEY = 'researchiq_jwt';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Inject JWT on every request
apiClient.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 dispatch a logout event (picked up by AppContext listener)
apiClient.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      clearToken();
      window.dispatchEvent(new CustomEvent('researchiq:logout'));
    }
    return Promise.reject(err);
  }
);

export default apiClient;
