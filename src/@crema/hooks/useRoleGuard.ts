'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { App } from 'antd';

type Role = 'ADMIN' | 'COACH' | 'LEARNER' | string;

interface RedirectConfig {
  unauthenticated?: string; // default '/signin'
  ADMIN?: string;
  COACH?: string;
  LEARNER?: string;
  fallback?: string; // default '/signin'
}

export const useRoleGuard = (allowedRoles: Role[], redirect?: RedirectConfig) => {
  const router = useRouter();
  const { message } = App.useApp();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === 'undefined') return;

      try {
        const userStr = localStorage.getItem('user');

        // Not logged in
        if (!userStr) {
          message.warning('Vui lòng đăng nhập để tiếp tục');
          router.replace(redirect?.unauthenticated || '/signin');
          return;
        }

        const user = JSON.parse(userStr);
        const role: Role | undefined = user?.role;

        // No role found
        if (!role) {
          message.warning('Vui lòng đăng nhập để tiếp tục');
          router.replace(redirect?.fallback || '/signin');
          return;
        }

        // Role is allowed
        if (allowedRoles.includes(role)) {
          setIsAuthorized(true);
          setIsChecking(false);
          return;
        }

        // Not allowed -> redirect based on role
        const roleRedirect =
          (redirect && (redirect as Record<string, string>)[role]) ||
          (role === 'ADMIN'
            ? '/dashboard'
            : role === 'LEARNER'
              ? '/home'
              : redirect?.fallback || '/signin');

        message.warning('Bạn không có quyền truy cập trang này');
        router.replace(roleRedirect);
      } catch (error) {
        console.error('Auth check error:', error);
        message.error('Có lỗi xảy ra, vui lòng đăng nhập lại');
        router.replace(redirect?.fallback || '/signin');
      }
    };

    checkAuth();
  }, [allowedRoles, redirect, router, message]);

  return { isAuthorized, isChecking };
};

export default useRoleGuard;
