'use client';

import { useAuth } from '@/lib/auth-provider';
import { DashboardStats } from '@/modules/dashboard/dashboard-stats';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Xin chào, {user?.name}!</h1>
        <p className="mt-1 text-sm text-gray-600">Tổng quan về hoạt động thanh toán của bạn</p>
      </div>

      <DashboardStats />
      <RecentTransactions />
    </div>
  );
}
