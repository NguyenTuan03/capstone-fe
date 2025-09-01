'use client';
/**
 * JWT Authentication Provider
 *
 * This component provides JWT (JSON Web Token) authentication functionality throughout the application.
 * It manages the authentication state, user data, and authentication-related actions using React Context.
 *
 * Features:
 * - Handles user authentication state
 * - Manages access and refresh tokens
 * - Provides sign-in and logout functionality
 * - Automatically loads user data on mount
 * - Handles token persistence based on "remember me" preference
 * - Manages user permissions
 */

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import jwtAxios, { setAuthToken, setRefreshToken } from './index';
import {
  REDIRECT_URL_KEY,
  REFRESH_TOKEN_KEY,
  REMEMBER_ME_KEY,
  TOKEN_KEY,
} from '@/@crema/constants/AppConst';
import { UserType } from '@/@crema/types/auth';
import Cookies from 'universal-cookie';

/**
 * Props for the authentication context
 * Contains the current authentication state and user data
 */
interface JWTAuthContextProps {
  user: UserType | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Props for sign-in operation
 */
interface SignInProps {
  email: string;
  password: string;
  remember: boolean;
}

/**
 * Available authentication actions
 */
interface JWTAuthActionsProps {
  signInUser: (data: SignInProps) => void;
  logout: () => void;
}

/**
 * Context for authentication state
 * Provides current user data and authentication status
 */
const JWTAuthContext = createContext<JWTAuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});

/**
 * Context for authentication actions
 * Provides methods to sign in and logout
 */
const JWTAuthActionsContext = createContext<JWTAuthActionsProps>({
  signInUser: () => undefined,
  logout: () => undefined,
});

// Custom hooks to access auth contexts
export const useJWTAuth = () => useContext(JWTAuthContext);

export const useJWTAuthActions = () => useContext(JWTAuthActionsContext);

interface JWTAuthAuthProviderProps {
  children: ReactNode;
}

/**
 * Main JWT Authentication Provider Component
 *
 * This component wraps the application and provides authentication functionality:
 * 1. Manages authentication state
 * 2. Handles token storage and retrieval
 * 3. Provides sign-in and logout methods
 * 4. Automatically loads user data when a token exists
 */
const JWTAuthAuthProvider: React.FC<JWTAuthAuthProviderProps> = ({ children }) => {
  const cookies = new Cookies();
  const [jwtAuthData, setJWTAuthData] = useState<JWTAuthContextProps>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  /**
   * Effect to load user data on component mount
   * Checks for existing token and fetches user data if found
   */
  useEffect(() => {
    const getAuthUser = async () => {
      const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
      if (!token) {
        setJWTAuthData({
          user: undefined,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }

      // Set up token and fetch user data
      const remember = JSON.parse(localStorage.getItem(REMEMBER_ME_KEY) || 'false');
      setAuthToken(token, remember);
      try {
        const { data } = await jwtAxios.get('current-user', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: false,
          withXSRFToken: false,
        });

        // Update auth state with user data and permissions
        setJWTAuthData({
          user: data?.data,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch {
        setJWTAuthData({
          user: undefined,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    getAuthUser();
  }, []);

  /**
   * Utility function to remove all XSRF tokens from cookies
   * This is important for security when logging out or switching users
   */
  const removeAllXSRFTokens = () => {
    const allCookies = cookies.getAll();
    const cookieName = 'XSRF-TOKEN';

    Object.keys(allCookies).forEach((cookieKey) => {
      if (cookieKey === cookieName) {
        cookies.remove(cookieKey, { path: '/' });
      }
    });
  };

  /**
   * Handles user sign-in
   * 1. Makes login request to API
   * 2. Stores received tokens
   * 3. Updates authentication state
   * 4. Loads user permissions
   */
  const signInUser = async ({ email, password, remember }: SignInProps) => {
    removeAllXSRFTokens();
    try {
      const { data } = await jwtAxios.post('login', {
        email,
        password,
      });

      // Store authentication tokens
      setAuthToken(data.data.token, remember);
      setRefreshToken(data.data.refresh_token, remember);

      // Update authentication state
      setJWTAuthData({
        user: data.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      const redirectUrl = localStorage.getItem(REDIRECT_URL_KEY);
      if (redirectUrl) {
        location.href = redirectUrl;
        localStorage.removeItem(REDIRECT_URL_KEY);
      } else {
        location.href = '/';
      }
    } catch {
      setJWTAuthData({
        ...jwtAuthData,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  /**
   * Handles user logout
   * 1. Revokes token on the server
   * 2. Cleans up local tokens and cookies
   * 3. Resets authentication state
   */
  const logout = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
      if (token) {
        await jwtAxios.post(
          'logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clean up authentication state
      removeAllXSRFTokens();
      setAuthToken();
      setRefreshToken();
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      setJWTAuthData({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  return (
    <JWTAuthContext.Provider
      value={{
        ...jwtAuthData,
      }}
    >
      <JWTAuthActionsContext.Provider
        value={{
          signInUser,
          logout,
        }}
      >
        {children}
      </JWTAuthActionsContext.Provider>
    </JWTAuthContext.Provider>
  );
};

export default JWTAuthAuthProvider;
