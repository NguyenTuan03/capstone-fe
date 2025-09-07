'use client';

import AppLoader from '@/@crema/components/AppLoader';
import { useJWTAuth } from '@/@crema/services/jwt-auth/JWTAuthProvider';
import Header from '@/modules/layout/header';
import Sidebar from '@/modules/layout/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useJWTAuth();
  if (isLoading) {
    <div className="flex items-center justify-center min-h-screen">
      <AppLoader />
    </div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:pl-72">
        <Header />
        <Sidebar />

        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
