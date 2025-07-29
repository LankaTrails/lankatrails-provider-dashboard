import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import store from '../store';
import { refreshToken } from '@/store/authSlice';
import { sessionExpired } from '@/store/authSlice';

let accessToken: string | null = null;
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;
let requestQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null) => {
  console.log('🔄 Processing request queue', {
    queueLength: requestQueue.length,
    hasError: !!error,
    hasToken: !!token
  });

  requestQueue.forEach(prom => {
    if (error) {
      console.log('❌ Rejecting queued request with error:', error.message || error);
      prom.reject(error);
    } else {
      console.log('✅ Resolving queued request with new token');
      prom.resolve(token!);
    }
  });
  requestQueue = [];
  console.log('🧹 Request queue cleared');
};

export const setAccessToken = (token: string | null) => {
  console.log('🔑 Setting access token', {
    hasToken: !!token,
    tokenLength: token ? token.length : 0
  });
  accessToken = token;
};

const api = axios.create({
  baseURL:  'http://localhost:8081/api',
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`);

    if (accessToken) {
      console.log('🔍 Access token found, checking expiry');
      const decoded: any = jwtDecode(accessToken);
      const isExpired = Date.now() >= decoded.exp * 1000;
      const timeUntilExpiry = (decoded.exp * 1000 - Date.now()) / 1000;

      console.log('⏰ Token expiry check', {
        isExpired,
        timeUntilExpiry: `${Math.round(timeUntilExpiry)}s`,
        expiresAt: new Date(decoded.exp * 1000).toISOString()
      });

      if (isExpired) {
        console.log('🔄 Token expired, handling refresh');

        if (!isRefreshing) {
          console.log('🔄 Starting token refresh process');
          isRefreshing = true;
          refreshPromise = new Promise(async (resolve, reject) => {
            try {
              console.log('📞 Calling refresh token API');
              const newToken = await store.dispatch(refreshToken()).unwrap();
              console.log('✅ Token refresh successful');
              setAccessToken(newToken);
              processQueue(null, newToken);
              resolve(newToken);
            } catch (err) {
              console.error('❌ Token refresh failed:', err);
              processQueue(err, null);
              store.dispatch(sessionExpired());
              reject(err);
            } finally {
              isRefreshing = false;
              refreshPromise = null;
              console.log('🔄 Token refresh process completed');
            }
          });
        }

        if (refreshPromise) {
          console.log('⏳ Waiting for token refresh to complete');
          try {
            const newToken = await refreshPromise;
            console.log('✅ Got refreshed token, updating request headers');
            config.headers.Authorization = `Bearer ${newToken}`;
            return config;
          } catch (err) {
            console.error('❌ Failed to get refreshed token:', err);
            throw err;
          }
        }
      } else {
        console.log('✅ Token valid, adding to request headers');
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } else {
      console.log('🔓 No access token available, proceeding without auth header');
    }

    return config;
  },
  (error: any) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for additional logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`, {
      status: response.status,
      statusText: response.statusText,
      dataSize: JSON.stringify(response.data).length
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response.status}`, {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('❌ Network error - no response received:', {
        url: error.config?.url,
        method: error.config?.method
      });
    } else {
      console.error('❌ Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
