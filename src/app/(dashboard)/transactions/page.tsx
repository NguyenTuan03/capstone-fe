'use client';

import { useState } from 'react';

export default function TransactionsPage() {
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    search: '',
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Giao dịch</h1>
        <p className="mt-1 text-sm text-gray-600">
          Quản lý và theo dõi tất cả các giao dịch của bạn
        </p>
      </div>
    </div>
  );
}
