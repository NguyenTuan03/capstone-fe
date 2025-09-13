import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const apiCall = async <TData = unknown>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: any;
    params?: Record<string, any>;
  } = {},
): Promise<TData> => {
  const { method = 'GET', data, params } = options;

  const url = new URL(endpoint, process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000');
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

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

interface BaseApiOptions {
  endpoint: string;
  queryKey?: string;
  staleTime?: number;
  gcTime?: number;
}

export function useBaseApiHooks<TData = any, TCreateData = any, TUpdateData = any>(
  endpoint: string,
  options?: Partial<BaseApiOptions>,
) {
  const queryKey = options?.queryKey || endpoint;
  const staleTime = options?.staleTime || 5 * 60 * 1000;
  const gcTime = options?.gcTime || 10 * 60 * 1000;

  const useGetItems = (params?: Record<string, any>) => {
    return useQuery({
      queryKey: [queryKey, 'list', params],
      queryFn: () => apiCall<TData[]>(endpoint, { params }),
      staleTime,
      gcTime,
    });
  };

  const useCreateItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (data: TCreateData) => apiCall<TData>(endpoint, { method: 'POST', data }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey, 'list'] });
      },
    });
  };

  const useUpdateItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, data }: { id: string | number; data: TUpdateData }) =>
        apiCall<TData>(`${endpoint}/${id}`, { method: 'PUT', data }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey, 'list'] });
      },
    });
  };

  const useRemoveItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: string | number) => apiCall<void>(`${endpoint}/${id}`, { method: 'DELETE' }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey, 'list'] });
      },
    });
  };

  return {
    useGetItems,
    useCreateItem,
    useUpdateItem,
    useRemoveItem,
  };
}

export function useBaseApi<TData = any, TCreateData = any, TUpdateData = any>(
  endpoint: string,
  options?: Partial<BaseApiOptions>,
) {
  return useBaseApiHooks<TData, TCreateData, TUpdateData>(endpoint, options);
}

export function createBaseApi<TData = any, TCreateData = any, TUpdateData = any>(
  endpoint: string,
  options?: Partial<BaseApiOptions>,
) {
  return () => useBaseApiHooks<TData, TCreateData, TUpdateData>(endpoint, options);
}
