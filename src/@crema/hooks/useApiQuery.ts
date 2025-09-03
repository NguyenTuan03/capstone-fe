import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';

// Generic API hook types
interface ApiQueryOptions<TData = unknown, TError = Error>
  extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {
  endpoint: string;
  params?: Record<string, any>;
}

interface ApiMutationOptions<TData = unknown, TVariables = unknown, TError = Error>
  extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

// Generic API functions
const apiCall = async <TData = unknown>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: any;
    params?: Record<string, any>;
  } = {},
): Promise<TData> => {
  const { method = 'GET', data, params } = options;

  // Build URL with query parameters
  const url = new URL(endpoint, process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000');
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Get token from localStorage
  const token = localStorage.getItem('token');

  const response = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(data && { body: JSON.stringify(data) }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// Generic query hook
export const useApiQuery = <TData = unknown, TError = Error>(
  options: ApiQueryOptions<TData, TError>,
) => {
  const { endpoint, params, ...queryOptions } = options;

  return useQuery({
    queryKey: [endpoint, params],
    queryFn: () => apiCall<TData>(endpoint, { params }),
    ...queryOptions,
  });
};

// Generic mutation hook
export const useApiMutation = <TData = unknown, TVariables = unknown, TError = Error>(
  options: ApiMutationOptions<TData, TVariables, TError>,
) => {
  const { endpoint, method = 'POST', ...mutationOptions } = options;

  return useMutation({
    mutationFn: (variables: TVariables) => apiCall<TData>(endpoint, { method, data: variables }),
    ...mutationOptions,
  });
};

// Specific API hooks for common operations
export const useGet = <TData = unknown>(
  endpoint: string,
  params?: Record<string, any>,
  options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>,
) => {
  return useApiQuery<TData>({
    endpoint,
    params,
    ...options,
  });
};

export const usePost = <TData = unknown, TVariables = unknown>(
  endpoint: string,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>,
) => {
  return useApiMutation<TData, TVariables>({
    endpoint,
    method: 'POST',
    ...options,
  });
};

export const usePut = <TData = unknown, TVariables = unknown>(
  endpoint: string,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>,
) => {
  return useApiMutation<TData, TVariables>({
    endpoint,
    method: 'PUT',
    ...options,
  });
};

export const useDelete = <TData = unknown, TVariables = unknown>(
  endpoint: string,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>,
) => {
  return useApiMutation<TData, TVariables>({
    endpoint,
    method: 'DELETE',
    ...options,
  });
};

// Utility hook for invalidating queries
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries(),
    invalidateByKey: (queryKey: (string | number)[]) => queryClient.invalidateQueries({ queryKey }),
    invalidateByPattern: (pattern: string) =>
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some((key) => typeof key === 'string' && key.includes(pattern)),
      }),
  };
};

// Hook for optimistic updates
export const useOptimisticUpdate = <TData = unknown>(
  queryKey: (string | number)[],
  updateFn: (oldData: TData | undefined, newData: any) => TData,
) => {
  const queryClient = useQueryClient();

  return {
    optimisticUpdate: (newData: any) => {
      queryClient.setQueryData(queryKey, (oldData: TData | undefined) =>
        updateFn(oldData, newData),
      );
    },
    rollback: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  };
};
