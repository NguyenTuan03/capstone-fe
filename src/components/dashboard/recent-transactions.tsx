'use client';

import { useQuery } from '@tanstack/react-query';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  id: string;
  type: 'incoming' | 'outgoing';
  amount: number;
  currency: string;
  description: string;
  recipientName: string;
  createdAt: string;
  status: 'completed' | 'pending' | 'failed';
}

export function RecentTransactions() {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['recent-transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions/recent');
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Giao dịch gần đây
          </h3>
          <Link
            href="/transactions"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Xem tất cả
          </Link>
        </div>
      </div>
      <div className="p-6">
        {transactions && transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'incoming' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.type === 'incoming' ? (
                    <ArrowDownLeft className="h-5 w-5" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.recipientName} • {formatRelativeTime(transaction.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    transaction.type === 'incoming' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'incoming' ? '+' : '-'}
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </p>
                  <p className={`text-xs ${
                    transaction.status === 'completed' 
                      ? 'text-green-500' 
                      : transaction.status === 'pending'
                      ? 'text-yellow-500'
                      : 'text-red-500'
                  }`}>
                    {transaction.status === 'completed' && 'Hoàn thành'}
                    {transaction.status === 'pending' && 'Đang xử lý'}
                    {transaction.status === 'failed' && 'Thất bại'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Chưa có giao dịch nào</p>
          </div>
        )}
      </div>
    </div>
  );
}