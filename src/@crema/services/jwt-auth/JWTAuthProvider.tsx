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
import { REFRESH_TOKEN_KEY, REMEMBER_ME_KEY, TOKEN_KEY } from '@/@crema/constants/AppConst';
import { UserType } from '@/@crema/types/auth';
import Cookies from 'universal-cookie';
import { useRouter, usePathname } from 'next/navigation';
import { RoleEnum } from '@/@crema/constants/AppEnums';
import { message } from 'antd';
import { useIntl } from 'react-intl';

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
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<boolean>;
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
  requestPasswordReset: () => Promise.resolve(false),
  resetPassword: () => Promise.resolve(false),
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
  const router = useRouter();
  const pathname = usePathname();
  const { messages: t } = useIntl();
  const [jwtAuthData, setJWTAuthData] = useState<JWTAuthContextProps>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Define public routes that don't require authentication
  const publicRoutes = ['/signin', '/register', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.includes(pathname);

  /**
   * Effect to load user data on component mount
   * Checks for existing token and fetches user data if found
   */
  useEffect(() => {
    const getAuthUser = async () => {
      const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

      // If no token and not on public route, redirect to signin
      if (!token) {
        setJWTAuthData({
          user: undefined,
          isLoading: false,
          isAuthenticated: false,
        });

        // if (!isPublicRoute) {
        //   router.push('/signin'); // DISABLED FOR UI DEVELOPMENT
        // }
        return;
      }

      // Set up token and fetch user data
      const remember = JSON.parse(localStorage.getItem(REMEMBER_ME_KEY) || 'false');
      setAuthToken(token, remember);

      try {
        // Simple check - if token exists and user saved, restore session
        const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

        if (savedUser && token.startsWith('admin-token-')) {
          const user: UserType = JSON.parse(savedUser);

          // Update auth state
          setJWTAuthData({
            user,
            isLoading: false,
            isAuthenticated: true,
          });

          // If on signin page, redirect to dashboard
          if (pathname === '/signin' || pathname === '/') {
            router.push('/dashboard');
          }
        } else {
          // No valid session
          cleanupAuthState();
          // if (!isPublicRoute) {
          //   router.push('/signin'); // DISABLED FOR UI DEVELOPMENT
          // }
        }
      } catch (error) {
        console.error('Auth error:', error);
        cleanupAuthState();
        // if (!isPublicRoute) {
        //   router.push('/signin'); // DISABLED FOR UI DEVELOPMENT
        // }
      }
    };

    getAuthUser();
  }, [pathname, isPublicRoute, router, t]);

  /**
   * Cleanup authentication state and tokens
   */
  const cleanupAuthState = () => {
    setAuthToken();
    setRefreshToken();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);

    setJWTAuthData({
      user: undefined,
      isLoading: false,
      isAuthenticated: false,
    });
  };

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
   * Simple fake login - just check admin/admin1 and go to dashboard
   */
  const signInUser = async ({ email, password, remember }: SignInProps) => {
    removeAllXSRFTokens();

    // Set loading state
    setJWTAuthData((prev) => ({ ...prev, isLoading: true }));

    // Simple fake delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simple check
    if (email.toLowerCase().trim() === 'admin' && password === 'admin1') {
      // Create simple user
      const fakeUser: UserType = {
        id: 'admin-001',
        email: 'admin',
        name: 'Admin User',
        role: 'admin',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        phone: '+84 901 234 567',
        location: 'Hồ Chí Minh',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store simple token
      const simpleToken = `admin-token-${Date.now()}`;
      setAuthToken(simpleToken, remember);

      // Update auth state
      setJWTAuthData({
        user: fakeUser,
        isAuthenticated: true,
        isLoading: false,
      });

      // Save user data
      try {
        if (remember) {
          localStorage.setItem('user', JSON.stringify(fakeUser));
          localStorage.setItem(REMEMBER_ME_KEY, 'true');
        } else {
          sessionStorage.setItem('user', JSON.stringify(fakeUser));
        }
      } catch (error) {
        console.error('Error saving user:', error);
      }

      message.success('Đăng nhập thành công!');
      router.push('/dashboard');
    } else {
      // Wrong credentials
      message.error('Sai tài khoản hoặc mật khẩu!');
      setJWTAuthData({
        user: null,
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
      cleanupAuthState();
      try {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      } catch {}

      // Redirect to signin page
      // router.push('/signin'); // DISABLED FOR UI DEVELOPMENT
    }
  };

  /**
   * Requests a password reset for a user
   * Sends a reset email to the provided email address
   * @param email User's email address
   * @returns Promise resolving to success status
   */
  const requestPasswordReset = async (email: string): Promise<boolean> => {
    try {
      await jwtAxios.post('request-password-reset', {
        email,
      });
      return true;
    } catch (error) {
      console.error('Password reset request error:', error);
      return false;
    }
  };

  /**
   * Resets a user's password using the token received via email
   * @param token Password reset token
   * @param newPassword New password
   * @param confirmPassword Confirmation of new password
   * @returns Promise resolving to success status
   */
  const resetPassword = async (
    token: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<boolean> => {
    try {
      await jwtAxios.post('reset-password', {
        token,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
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
          requestPasswordReset,
          resetPassword,
        }}
      >
        {children}
      </JWTAuthActionsContext.Provider>
    </JWTAuthContext.Provider>
  );
};

export default JWTAuthAuthProvider;
