'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import AppLoader from '@/@crema/components/AppLoader';
// import { useAuthUser } from '@/@crema/hooks/useAuth';

export default function Home() {
  const router = useRouter();

  // DEV-BYPASS: Always redirect to /dashboard while building UI.
  // Comment out this block to restore the original auth-based redirection below.
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);
  return null;

  /*
  // ORIGINAL AUTH LOGIC
  const { isAuthenticated, isLoading } = useAuthUser();

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
  */
}
