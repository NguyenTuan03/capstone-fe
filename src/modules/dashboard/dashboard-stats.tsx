'use client';

import { useQuery } from '@tanstack/react-query';
import { formatCurrency } from '@/lib/utils';

interface Stats {
  totalBalance: number;
  totalTransactions: number;
  successRate: number;
  monthlyGrowth: number;
}

export function DashboardStats() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      name: 'Số dư hiện tại',
      value: formatCurrency(stats.totalBalance),
      change: `+${stats.monthlyGrowth}%`,
      changeType: 'positive',
    },
    {
      name: 'Tổng giao dịch',
      value: stats.totalTransactions.toLocaleString(),
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Tỷ lệ thành công',
      value: `${stats.successRate}%`,
      change: '+2%',
      changeType: 'positive',
    },
    {
      name: 'Tăng trưởng tháng',
      value: `${stats.monthlyGrowth}%`,
      change: '+5%',
      changeType: 'positive',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statItems.map((stat) => (
        <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
