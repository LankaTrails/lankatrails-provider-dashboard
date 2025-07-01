import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import store from '../store';
import { refreshToken, logoutUser } from '@/store/authSlice';

let accessToken: string | null = null;
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: true,  // Important: send cookies!
});

// Set access token (used by authSlice)
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// Attach token to requests
api.interceptors.request.use(
  async (config) => {
    if (accessToken) {
      const decoded: any = jwtDecode(accessToken);
      const isExpired = Date.now() >= decoded.exp * 1000;

      if (isExpired) {
        console.warn('[API] Access token expired, attempting refresh...');
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const newToken = await store.dispatch(refreshToken()).unwrap();
            setAccessToken(newToken);
            processQueue(null, newToken);
          } catch (err) {
            processQueue(err, null);
            store.dispatch(logoutUser());
            throw err;
          } finally {
            isRefreshing = false;
          }
        }

        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              config.headers.Authorization = `Bearer ${token}`;
              resolve(config);
            },
            reject: (err: any) => {
              reject(err);
            }
          });
        });
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
