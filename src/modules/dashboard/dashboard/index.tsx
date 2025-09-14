'use client';

import { useJWTAuth } from '@/@crema/services/jwt-auth/JWTAuthProvider';

export default function DashboardClient() {
  const { user } = useJWTAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Xin chào, {user?.fullName}!</h1>
        <p className="mt-1 text-sm text-gray-600">Dashboard page</p>
      </div>
    </div>
  );
}
