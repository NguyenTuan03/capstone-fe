'use client';

import { useJWTAuth } from '@/@crema/services/jwt-auth/JWTAuthProvider';
import { Header } from '@/modules/layout/header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useJWTAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Middleware sẽ redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:pl-72">
        <Header />
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
