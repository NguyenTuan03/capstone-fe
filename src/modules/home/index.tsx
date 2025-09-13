'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLoader from '@/@crema/components/AppLoader';
import { useAuthUser } from '@/@crema/hooks/useAuth';
import { useJWTAuth } from '@/@crema/services/jwt-auth/JWTAuthProvider';
import { RoleEnum } from '@/@crema/constants/AppEnums';

export default function HomeClient() {
  const { isAuthenticated, isLoading } = useAuthUser();
  const { user } = useJWTAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If no user data or not authenticated, redirect to signin
      if (!user || !isAuthenticated) {
        router.replace('/signin');
        return;
      }

      // Check if user is Admin
      const isAdmin = user?.role?.name === RoleEnum.ADMIN;

      if (isAdmin) {
        router.replace('/dashboard');
      } else {
        // Non-Admin users should be redirected to signin
        router.replace('/signin');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

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
