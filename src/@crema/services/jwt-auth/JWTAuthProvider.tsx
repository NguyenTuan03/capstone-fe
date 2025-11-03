'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import jwtAxios, { setAuthToken, setRefreshToken } from './index';
import { REFRESH_TOKEN_KEY, REMEMBER_ME_KEY, TOKEN_KEY } from '@/@crema/constants/AppConst';
import { UserType } from '@/@crema/types/auth';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/navigation';
import { useFormMutation } from '@/@crema/hooks/useApiQuery';
import { App } from 'antd';
import { RoleEnum } from '@/@crema/constants/AppEnums';
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
  const { message } = App.useApp();
  const router = useRouter();
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
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!token || !savedUser) {
      setJWTAuthData({ user: undefined, isAuthenticated: false, isLoading: false });
      return;
    }
    const remember = JSON.parse(localStorage.getItem(REMEMBER_ME_KEY) || 'false');
    setAuthToken(token, remember);
    try {
      const user: UserType = JSON.parse(savedUser);
      setJWTAuthData({ user, isAuthenticated: true, isLoading: false });
    } catch {
      setJWTAuthData({ user: undefined, isAuthenticated: false, isLoading: false });
    }
  }, []);

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

  // TanStack mutation for login
  const loginMutation = useFormMutation<any, SignInProps>('auth/login', {
    method: 'POST',
    showSuccessMessage: false,
    // @ts-expect-error useFormMutation passes (data, variables, context)
    onSuccess: (res: any, variables: SignInProps) => {
      const accessToken = res?.metadata?.accessToken;
      const refreshToken = res?.metadata?.refreshToken;
      const user = res?.metadata?.user;
      if (!accessToken || !user) {
        message.error('Đăng nhập thất bại');
        setJWTAuthData({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      setAuthToken(accessToken, variables.remember);
      setRefreshToken(refreshToken || '', variables.remember);

      const mappedUser: UserType = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role?.name,
        avatar: user.avatar,
        phone: user.phone,
        location: user.location,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setJWTAuthData({ user: mappedUser, isAuthenticated: true, isLoading: false });

      try {
        if (variables.remember) {
          localStorage.setItem('user', JSON.stringify(mappedUser));
          localStorage.setItem(REMEMBER_ME_KEY, 'true');
        } else {
          sessionStorage.setItem('user', JSON.stringify(mappedUser));
        }
      } catch {}
      message.success('Đăng nhập thành công!');
      setTimeout(() => {
        if (mappedUser.role === RoleEnum.ADMIN) {
          router.push('/dashboard');
        } else if (mappedUser.role === RoleEnum.COACH) {
          router.push('/summary');
        } else {
          router.push('/home');
        }
      }, 1200);
    },
    onError: (err: Error) => {
      message.error(err.message || 'Sai tài khoản hoặc mật khẩu!');
      setJWTAuthData({ user: null, isAuthenticated: false, isLoading: false });
    },
  });

  const signInUser = async (data: SignInProps) => {
    // removeAllXSRFTokens();
    setJWTAuthData((prev) => ({ ...prev, isLoading: true }));
    await loginMutation.mutateAsync(data);
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
