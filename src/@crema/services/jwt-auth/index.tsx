/**
 * JWT Authentication Service
 *
 * This module handles JWT (JSON Web Token) authentication including:
 * - Token storage (in localStorage/sessionStorage)
 * - Token refresh mechanism
 * - Axios interceptors for handling 401 errors
 * - Automatic token refresh when expired
 */

import { REFRESH_TOKEN_KEY, REMEMBER_ME_KEY, TOKEN_KEY } from '@/@crema/constants/AppConst';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { log } from 'console';

// Types definitions for internal use
interface QueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}

interface RefreshTokenResponse {
  data: {
    token: string;
    refresh_token: string;
  };
}

// Constants used throughout the service
const AUTH_ERROR_STATUS = 401;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/' + process.env.NEXT_PUBLIC_VERSION;
/**
 * Check if code is running in browser environment
 * This is important for Next.js SSR compatibility
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Storage Utility Functions
 * These functions handle the complexity of working with both localStorage and sessionStorage
 * while ensuring SSR compatibility
 */
const getStorageItem = (key: string): string | null => {
  if (!isBrowser) return null;
  return localStorage.getItem(key) || sessionStorage.getItem(key);
};

const removeStorageItem = (key: string): void => {
  if (!isBrowser) return;
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
};

/**
 * Sets an item in either localStorage or sessionStorage based on the remember parameter
 * Also removes the item from the other storage to prevent conflicts
 */
const setStorageItem = (key: string, value: string, remember: boolean): void => {
  if (!isBrowser) return;
  const storage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;

  storage.setItem(key, value);
  otherStorage.removeItem(key);
};

/**
 * Token Management Functions
 * These functions handle getting and setting authentication tokens
 */
const getToken = (): string | null => {
  return getStorageItem(TOKEN_KEY);
};

const getRefreshToken = (): string | null => {
  return getStorageItem(REFRESH_TOKEN_KEY);
};

/**
 * Legacy token management functions
 * Maintained for backward compatibility with existing code
 * These functions are used by JWTAuthProvider
 */
export const setAuthToken = (token?: string, remember?: boolean): void => {
  if (!isBrowser) return;

  if (!token) {
    delete jwtAxios.defaults.headers.common.Authorization;
    removeStorageItem(TOKEN_KEY);
    removeStorageItem(REMEMBER_ME_KEY);
    return;
  }

  // Update axios headers with new token
  jwtAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
  localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(remember));
  setStorageItem(TOKEN_KEY, token, !!remember);
};

export const setRefreshToken = (token?: string, remember?: boolean): void => {
  if (!isBrowser) return;

  if (!token) {
    removeStorageItem(REFRESH_TOKEN_KEY);
    return;
  }

  setStorageItem(REFRESH_TOKEN_KEY, token, !!remember);
};

/**
 * Internal token management functions
 * These provide a cleaner interface for managing both tokens at once
 */
const setTokens = (token: string, refreshToken: string, remember: boolean): void => {
  setAuthToken(token, remember);
  setRefreshToken(refreshToken, remember);
};

const clearTokens = (): void => {
  setAuthToken();
  setRefreshToken();
};

/**
 * Create axios instance with default configuration
 * This instance will be used for all API calls
 */
const jwtAxios: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    credentials: 'include',
  },
});

/**
 * Queue Management for Token Refresh
 * When a token refresh is in progress, other requests are queued
 * Once the token is refreshed, all queued requests are processed
 */
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: any | null, token: string | null = null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Handles user logout by clearing tokens and redirecting to signin page
 * Safe to use in both browser and SSR environments
 */
const handleLogout = (): void => {
  clearTokens();
  if (isBrowser) {
    window.location.href = '/signin';
  }
};

/**
 * Refreshes the authentication token using the refresh token
 * Returns a new token if successful, throws an error if fails
 */
const refreshAuthToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post<RefreshTokenResponse>(
      `${API_BASE_URL}/refresh-token`,
      { refresh_token: refreshToken },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      },
    );

    const { token, refresh_token } = response.data.data;
    const remember = isBrowser
      ? JSON.parse(localStorage.getItem(REMEMBER_ME_KEY) || 'false')
      : false;
    setTokens(token, refresh_token, remember);

    return token;
  } catch (error) {
    clearTokens();
    throw error;
  }
};

/**
 * Axios Response Interceptor
 * Handles 401 errors by attempting to refresh the token
 * If refresh fails, logs out the user
 * Queues requests while token refresh is in progress
 */
jwtAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Only handle 401 errors that haven't been retried
    if (!error.response || error.response.status !== AUTH_ERROR_STATUS || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If a token refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return jwtAxios(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // Attempt to refresh the token
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const token = await refreshAuthToken();

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
      }

      processQueue(null, token);
      return jwtAxios(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      handleLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// Initialize auth header only in browser environment
if (isBrowser) {
  const token = getToken();
  if (token) {
    jwtAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
}

/**
 * Export token service interface for external use
 * Provides a clean API for token management
 */
export const tokenService = {
  getToken,
  getRefreshToken,
  setTokens,
  clearTokens,
};

export default jwtAxios;
export const ApiUrl = API_BASE_URL;
