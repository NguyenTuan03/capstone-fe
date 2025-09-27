'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { message } from 'antd';

interface QueryProviderProps {
  children: React.ReactNode;
}

// Enhanced mutation error handler
const handleMutationError = (error: Error) => {
  console.error('Mutation Error:', error);

  if (!error.message.includes('401')) {
    // Don't show error for 401 as it's handled by query error handler
    message.error(error.message || 'Có lỗi xảy ra khi thực hiện thao tác.');
  }
};

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
            retry: (failureCount, error: any) => {
              // Không retry cho 401, 403, 404
              if (
                error?.message?.includes('401') ||
                error?.message?.includes('403') ||
                error?.message?.includes('404')
              ) {
                return false;
              }
              return failureCount < 3;
            },
            // Retry delay tăng dần
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch khi window focus (disabled for better UX)
            refetchOnWindowFocus: false,
            // Refetch khi reconnect
            refetchOnReconnect: true,
            // Background refetch interval: 5 phút cho data quan trọng
            refetchInterval: false,
            // Enable throwing errors to be caught by error boundaries
            throwOnError: true,
          },
          mutations: {
            // Retry 1 lần cho mutations (trừ error không thể retry)
            retry: (failureCount, error: any) => {
              if (
                error?.message?.includes('401') ||
                error?.message?.includes('403') ||
                error?.message?.includes('404') ||
                error?.message?.includes('409')
              ) {
                // Conflict
                return false;
              }
              return failureCount < 1;
            },
            // Global mutation error handler
            onError: handleMutationError,
            // Global mutation success handler
            onSuccess: (data: any, variables: any, context: any) => {
              // Auto show success message for certain operations
              if (context?.showSuccessMessage) {
                message.success(context.successMessage || 'Thao tác thành công!');
              }
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Enhanced devtools config */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" buttonPosition="bottom-right" />
      )}
    </QueryClientProvider>
  );
}
