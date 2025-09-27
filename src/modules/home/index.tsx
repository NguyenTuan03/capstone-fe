'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLoader from '@/@crema/components/AppLoader';
import { useAuthUser } from '@/@crema/hooks/useAuth';
import { useJWTAuth } from '@/@crema/services/jwt-auth/JWTAuthProvider';

export default function HomeClient() {
  const { isAuthenticated, isLoading } = useAuthUser();
  const { user } = useJWTAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to signin immediately for UI development
    router.replace('/signin');
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-2xl">PL</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-3xl font-bold text-gray-800">PICKLE-LEARN</span>
              <span className="text-sm text-gray-500">Admin Portal</span>
            </div>
          </div>
          <AppLoader />
          <div className="text-gray-600 text-sm animate-pulse">Đang kiểm tra quyền truy cập...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-white font-bold text-2xl">PL</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-3xl font-bold text-gray-800">PICKLE-LEARN</span>
            <span className="text-sm text-gray-500">Admin Portal</span>
          </div>
        </div>
        <AppLoader />
        <div className="text-gray-600 text-sm animate-pulse">Đang chuyển hướng...</div>
      </div>
    </div>
  );
}
