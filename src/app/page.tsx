'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLoader from '@/@crema/components/AppLoader';
import { useAuthUser } from '@/@crema/hooks/useAuth';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    try {
      const ssUser = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
      const lsUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (ssUser || lsUser) {
        router.replace('/dashboard');
        return;
      }
    } catch {}

    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/signin');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen fixed inset-0 z-50">
        <AppLoader />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen fixed inset-0 z-50">
      <AppLoader />
    </div>
  );
}
