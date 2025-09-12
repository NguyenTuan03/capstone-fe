'use client';

import React from 'react';
import { useJWTAuth } from '@/@crema/services/jwt-auth/JWTAuthProvider';
import { Spin } from 'antd';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const { messages: t } = useIntl();
  console.log('pathname', pathname);
  // Define public routes that don't require authentication
  const publicRoutes = ['/signin', '/register', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.includes(pathname);

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
          gap: '16px',
        }}
      >
        <Spin size="large" />
        <div style={{ color: '#666', fontSize: '16px' }}>{t['common.loading'] as string}</div>
      </div>
    );
  }

  // For public routes, always render children
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // For protected routes, only render if authenticated
  if (isAuthenticated && user) {
    return <>{children}</>;
  }

  // If not authenticated and not on public route,
  // the JWT Provider will handle redirect to signin
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        gap: '16px',
      }}
    >
      <Spin size="large" />
      <div style={{ color: '#666', fontSize: '16px' }}>{t['common.redirecting'] as string}</div>
    </div>
  );
};

export default AppAuthGuard;
