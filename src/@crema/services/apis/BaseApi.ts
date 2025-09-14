'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/** Utils ghép URL an toàn */
const getEnvApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8386/api';
const getEnvVersion = () => process.env.NEXT_PUBLIC_VERSION || 'v1';

const normalize = (...parts: string[]) =>
  ('/' + parts.join('/'))
    .replace(/\/{2,}/g, '/') // gộp // → /
    .replace(/\/+$/g, ''); // bỏ slash cuối

const buildUrl = (endpoint: string, params?: Record<string, any>) => {
  // Nếu endpoint là absolute (http...), dùng luôn
  if (/^https?:\/\//i.test(endpoint)) {
    const u = new URL(endpoint);
    if (params)
      Object.entries(params).forEach(([k, v]) => v != null && u.searchParams.append(k, String(v)));
    return u.toString();
  }

  // Phân tích base
  const baseRaw = getEnvApiUrl(); // ví dụ: http://localhost:8386/api
  const origin = (() => {
    // Nếu baseRaw đã có origin hợp lệ
    try {
      const u = new URL(baseRaw);
      return `${u.protocol}//${u.host}`; // http://localhost:8386
    } catch {
      return 'http://localhost:8386';
    }
  })();

  const basePath = (() => {
    try {
      const u = new URL(baseRaw);
      return u.pathname || '/'; // ví dụ: /api hoặc /
    } catch {
      return '/';
    }
  })();

  const version = getEnvVersion(); // v1

  let finalPath: string;
  if (endpoint.startsWith('/')) {
    // absolute path → dùng nguyên xi (VD: /api/v1/users)
    finalPath = endpoint;
  } else {
    // relative resource (VD: 'users')
    const hasApiInBase = basePath.split('/').includes('api');
    finalPath = hasApiInBase
      ? normalize(basePath, version, endpoint) // /api/v1/users
      : normalize('/api', version, endpoint); // /api/v1/users khi basePath = /
  }

  const url = new URL(finalPath, origin); // http://host/api/v1/users
  if (params)
    Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.append(k, String(v)));

  return url.toString();
};

const getAuthHeader = () => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiCall = async <TData = unknown>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: any;
    params?: Record<string, any>;
  } = {},
): Promise<TData> => {
  const { method = 'GET', data, params } = options;

  const url = buildUrl(endpoint, params);

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    ...(data && { body: JSON.stringify(data) }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
};

/** ===== Hooks như bạn đang có, giữ nguyên API ===== */

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
  const staleTime = options?.staleTime ?? 5 * 60 * 1000;
  const gcTime = options?.gcTime ?? 10 * 60 * 1000;

  const useGetItems = (params?: Record<string, any>) =>
    useQuery({
      queryKey: [queryKey, 'list', params],
      queryFn: async () => {
        const response = await apiCall<any>(endpoint, { params });
        // Transform response từ { statusCode, message, metadata } thành PaginatedAPIResponse
        if (response?.metadata) {
          return {
            data: response.metadata.data,
            currentPage: response.metadata.currentPage,
            lastPage: response.metadata.lastPage,
            total: response.metadata.total,
            perPage: response.metadata.perPage,
          };
        }
        return response;
      },
      staleTime,
      gcTime,
      enabled: !!endpoint, // Chỉ fetch khi có endpoint
      refetchOnMount: false, // Không auto-fetch khi mount
      refetchOnWindowFocus: false, // Không auto-fetch khi focus window
    });

  const useCreateItem = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (data: TCreateData) => apiCall<TData>(endpoint, { method: 'POST', data }),
      onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey, 'list'] }),
    });
  };

  const useUpdateItem = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string | number; data: TUpdateData }) =>
        apiCall<TData>(`${endpoint}/${id}`, { method: 'PUT', data }),
      onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey, 'list'] }),
    });
  };

  const useRemoveItem = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string | number) => apiCall<void>(`${endpoint}/${id}`, { method: 'DELETE' }),
      onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey, 'list'] }),
    });
  };

  return { useGetItems, useCreateItem, useUpdateItem, useRemoveItem };
}

export const useBaseApi = useBaseApiHooks;

export function createBaseApi<TData = any, TCreateData = any, TUpdateData = any>(
  endpoint: string,
  options?: Partial<BaseApiOptions>,
) {
  return () => useBaseApiHooks<TData, TCreateData, TUpdateData>(endpoint, options);
}
