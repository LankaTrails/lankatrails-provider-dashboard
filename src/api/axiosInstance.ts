import axios from 'axios';

let refreshTokenPromise: Promise<any> | null = null;

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
  timeout: 10000, // Add timeout (10 seconds)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Client-Type': 'web',
  }
});

const apiLogger = {
  request: (config: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params
      });
    }
    return config;
  },
  response: (response: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[API] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        data: response.data
      });
    }
    return response;
  },
  error: (error: any) => {
    console.error(`[API Error] ${error.response?.status || 'Network Error'} ${error.config?.method?.toUpperCase() || ''} ${error.config?.url || ''}`, {
      message: error.message,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
};

api.interceptors.request.use(
  config => apiLogger.request(config),
  error => apiLogger.error(error)
);

api.interceptors.response.use(
  response => apiLogger.response(response),
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      if (!refreshTokenPromise) {
        refreshTokenPromise = api.post('/auth/refresh-token')
          .finally(() => { refreshTokenPromise = null; });
      }

      try {
        await refreshTokenPromise;
        return api(originalRequest);
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('forceLogout'));
        }
        return Promise.reject(refreshError);
      }
    }

    return apiLogger.error(error);
  }
);

export default api;