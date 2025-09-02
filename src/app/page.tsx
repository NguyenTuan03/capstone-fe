'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLoader from '@/@crema/components/AppLoader';
import { useAuthUser } from '@/@crema/hooks/useAuth';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      !isAuthenticated ? router.replace('/signin') : router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen fixed inset-0 z-50">
      <AppLoader />
    </div>
  );
}
