import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/lib/config";
import { setCurrentToken } from "@/services/tokenService";

/**
 * The access token lives only in memory (mirrored to tokenService for the WebSocket).
 * The refresh token is an HttpOnly cookie, so a page reload can restore the session.
 */
let accessToken: string | null = null;
let refreshInFlight: Promise<string> | null = null;
let onSessionExpired: (() => void) | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  setCurrentToken(token);
};

/** Registered by the store so this module does not import it (avoids a circular import). */
export const setSessionExpiredHandler = (handler: () => void) => {
  onSessionExpired = handler;
};

// Separate client without interceptors: the refresh call must never wait on itself.
const refreshClient = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

/** Exchanges the refresh cookie for a new access token. Concurrent callers share one request. */
export function refreshAccessToken(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = refreshClient
      .post("/auth/refresh-token")
      .then((res) => {
        const token: string = res.data.data.jwtToken;
        setAccessToken(token);
        return token;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

const api = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

type RetriableRequest = InternalAxiosRequestConfig & { _retried?: boolean };

// On 401, refresh once and replay the request; if that fails the session is over.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableRequest | undefined;
    const isAuthCall = original?.url?.startsWith("/auth/");
    if (error.response?.status !== 401 || !original || original._retried || isAuthCall) {
      return Promise.reject(error);
    }
    original._retried = true;
    try {
      const token = await refreshAccessToken();
      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    } catch (refreshError) {
      setAccessToken(null);
      onSessionExpired?.();
      return Promise.reject(refreshError);
    }
  },
);

export default api;
