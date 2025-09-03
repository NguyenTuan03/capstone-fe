'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Thời gian cache mặc định: 5 phút
            staleTime: 5 * 60 * 1000,
            // Thời gian garbage collection: 10 phút
            gcTime: 10 * 60 * 1000,
            // Retry 3 lần khi fail
            retry: 3,
            // Refetch khi window focus
            refetchOnWindowFocus: false,
            // Refetch khi reconnect
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry 1 lần cho mutations
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Chỉ hiển thị devtools trong development */}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
