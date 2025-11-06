'use client';

import React from 'react';
import { useJWTAuth } from '@/@crema/services/jwt-auth/JWTAuthProvider';
import { Spin } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { RoleEnum } from '@/@crema/constants/AppEnums';
import { useIntl } from 'react-intl';

interface AppAuthGuardProps {
  children: React.ReactNode;
}

/**
 * Authentication Guard Component
 *
 * This component protects routes by checking authentication status.
 * It shows loading spinner while checking auth state and prevents
 * rendering children until authentication is verified.
 */
const AppAuthGuard: React.FC<AppAuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useJWTAuth();
  const { messages: t } = useIntl();
  const pathname = usePathname();
  const router = useRouter();

  // Define public routes that don't require authentication
  const publicRoutes = ['/signin', '/register', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Handle redirects in useEffect to avoid conditional hook calls
  React.useEffect(() => {
    // Don't redirect on public routes or while loading
    if (isPublicRoute || isLoading) return;

    const isAdmin = user?.role === RoleEnum.ADMIN;

    // Redirect if not authenticated or not admin
    if (!isAuthenticated || (user && !isAdmin)) {
      router.replace('/signin');
    }
  }, [isAuthenticated, isLoading, user, isPublicRoute, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Spin size="large" tip={t['common.loading'] as string}>
          <div style={{ height: '200px', width: '200px' }} />
        </Spin>
      </div>
    );
  }

  // For public routes, always render children
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Check if user exists and is Admin
  const isAdmin = user?.role === RoleEnum.ADMIN;

  // For protected routes, only render if authenticated AND user is Admin
  if (isAuthenticated && user && isAdmin) {
    return <>{children}</>;
  }

  // If user exists but is not Admin, show loading while redirecting
  if (user && !isAdmin) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Spin size="large" tip="Đang chuyển hướng...">
          <div style={{ height: '200px', width: '200px' }} />
        </Spin>
      </div>
    );
  }

  // If not authenticated, show loading while redirecting
  if (!isAuthenticated) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Spin size="large" tip="Đang chuyển hướng đến trang đăng nhập...">
          <div style={{ height: '200px', width: '200px' }} />
        </Spin>
      </div>
    );
  }

  // Fallback: show loading
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Spin size="large" tip="Đang chuyển hướng...">
        <div style={{ height: '200px', width: '200px' }} />
      </Spin>
    </div>
  );
};

export default AppAuthGuard;
