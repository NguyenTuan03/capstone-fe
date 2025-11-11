'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import axios from '@/@crema/axios/ApiConfig';
import { TOKEN_KEY } from '@/@crema/constants/AppConst';

/* =========================
   URL builder (Cách 1)
   ========================= */
const getBase = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8386'; // ví dụ: http://localhost:8386/api
const getVersion = () => process.env.NEXT_PUBLIC_VERSION || 'v1';

const normalize = (...parts: string[]) =>
  ('/' + parts.join('/')).replace(/\/{2,}/g, '/').replace(/\/+$/g, '');

const buildUrl = (endpoint: string, params?: Record<string, any>) => {
  // absolute URL -> dùng luôn
  if (/^https?:\/\//i.test(endpoint)) {
    const u = new URL(endpoint);
    if (params)
      Object.entries(params).forEach(([k, v]) => v != null && u.searchParams.append(k, String(v)));
    return u.toString();
  }

  // tách origin & basePath từ NEXT_PUBLIC_API_URL
  const baseRaw = getBase(); // ví dụ http://localhost:8386/api
  let origin = 'http://localhost:8386';
  let basePath = '/';
  try {
    const u = new URL(baseRaw);
    origin = `${u.protocol}//${u.host}`; // http://localhost:8386
    basePath = u.pathname || '/'; // /api hoặc /
  } catch {
    /* noop */
  }

  const version = getVersion(); // v1
  const hasApiInBase = basePath.split('/').includes('api');

  // QUAN TRỌNG:
  // - endpoint bắt đầu bằng "/" => absolute path -> KHÔNG auto gắn /api/v1
  // - endpoint KHÔNG "/" đầu (ví dụ "users") => auto gắn /api/v1
  const finalPath = endpoint.startsWith('/')
    ? endpoint
    : hasApiInBase
      ? normalize(basePath, version, endpoint) // base có /api -> /api/v1/users
      : normalize('/api', version, endpoint); // base không có /api -> /api/v1/users

  const url = new URL(finalPath, origin); // http://host/api/v1/users
  if (params)
    Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.append(k, String(v)));
  return url.toString();
};

const getAuthHeader = () => {
  if (typeof window === 'undefined') return {};
  // Try multiple token keys for compatibility
  const token =
    localStorage.getItem(TOKEN_KEY) ||
    localStorage.getItem('token') ||
    sessionStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* =========================
   API call dùng builder trên
   ========================= */
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
  const authHeaders = getAuthHeader();

  // Debug: Log token status (remove in production)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const token =
      localStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem('token') ||
      sessionStorage.getItem(TOKEN_KEY) ||
      sessionStorage.getItem('token');
    console.log('[apiCall]', method, url, {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
      authHeader: authHeaders,
    });
    if (!token) {
      console.warn('[apiCall] No token found in storage for', method, url);
    }
  }

  try {
    const response = await axios.request<TData>({
      url,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      ...(data && { data }),
    });
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || `Request failed for ${method} ${url}`;
    throw new Error(message);
  }
};

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
    mutationFn: (variables: TVariables) => {
      // Support path params like ":id" from variables object
      let finalEndpoint = endpoint;
      try {
        if (variables && typeof variables === 'object') {
          finalEndpoint = endpoint.replace(/:([a-zA-Z_]\w*)/g, (_match, key) => {
            const value = (variables as any)[key];
            return value != null ? String(value) : _match;
          });
        }
      } catch {
        /* noop */
      }
      return apiCall<TData>(finalEndpoint, { method, data: variables });
    },
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

// ================================
// ENHANCED HOOKS FOR COMMON PATTERNS
// ================================

// Paginated query hook
export const usePaginatedQuery = <TData = unknown>(
  endpoint: string,
  options?: {
    page?: number;
    pageSize?: number;
    params?: Record<string, any>;
    queryOptions?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>;
  },
) => {
  const { page = 1, pageSize = 10, params = {}, queryOptions = {} } = options || {};

  const paginationParams = {
    page,
    pageSize,
    ...params,
  };

  return useApiQuery<TData>({
    endpoint,
    params: paginationParams,
    ...queryOptions,
  });
};

// CRUD Hooks for specific entities
export const useCrudOperations = <TData = unknown, TCreateData = unknown, TUpdateData = unknown>(
  entityName: string,
  options?: {
    endpoints?: {
      list?: string;
      create?: string;
      update?: string;
      delete?: string;
      detail?: string;
    };
  },
) => {
  const endpoints = {
    list: `/${entityName}`,
    create: `/${entityName}`,
    update: `/${entityName}`,
    delete: `/${entityName}`,
    detail: `/${entityName}`,
    ...options?.endpoints,
  };

  const queryClient = useQueryClient();

  // List query
  const useList = (params?: Record<string, any>) => {
    return useApiQuery<TData>({
      endpoint: endpoints.list,
      params,
    });
  };

  // Detail query
  const useDetail = (id: string | number, enabled = true) => {
    return useApiQuery<TData>({
      endpoint: `${endpoints.detail}/${id}`,
      enabled: enabled && !!id,
    });
  };

  // Create mutation
  const useCreate = () => {
    return useApiMutation<TData, TCreateData>({
      endpoint: endpoints.create,
      method: 'POST',
      onSuccess: () => {
        // Invalidate list queries
        queryClient.invalidateQueries({
          queryKey: [endpoints.list],
        });
      },
    });
  };

  // Update mutation
  const useUpdate = () => {
    return useMutation<TData, Error, TUpdateData & { id: string | number }>({
      mutationFn: (variables) =>
        apiCall<TData>(`${endpoints.update}/${variables.id}`, {
          method: 'PUT',
          data: variables,
        }),
      onSuccess: (data, variables) => {
        // Update specific item in cache
        queryClient.setQueryData([`${endpoints.detail}/${variables.id}`], data);
        // Invalidate list queries
        queryClient.invalidateQueries({
          queryKey: [endpoints.list],
        });
      },
    });
  };

  // Delete mutation
  const useRemove = () => {
    return useMutation<void, Error, { id: string | number }>({
      mutationFn: (variables) =>
        apiCall<void>(`${endpoints.delete}/${variables.id}`, { method: 'DELETE' }),
      onSuccess: (data, variables) => {
        // Remove from cache
        queryClient.removeQueries({
          queryKey: [`${endpoints.detail}/${variables.id}`],
        });
        // Invalidate list queries
        queryClient.invalidateQueries({
          queryKey: [endpoints.list],
        });
      },
    });
  };

  return {
    useList,
    useDetail,
    useCreate,
    useUpdate,
    useRemove,
  };
};

// Search hook with debouncing
export const useSearchQuery = <TData = unknown>(
  endpoint: string,
  searchTerm: string,
  options?: {
    debounceMs?: number;
    minSearchLength?: number;
    params?: Record<string, any>;
  },
) => {
  const { minSearchLength = 2, params = {} } = options || {};

  return useApiQuery<TData>({
    endpoint,
    params: {
      search: searchTerm,
      ...params,
    },
    enabled: searchTerm.length >= minSearchLength,
    staleTime: 30000, // 30 seconds for search results
  });
};

// Cache management utilities
export const useCacheManager = () => {
  const queryClient = useQueryClient();

  return {
    // Prefetch data
    prefetch: async <TData = unknown>(endpoint: string, params?: Record<string, any>) => {
      await queryClient.prefetchQuery({
        queryKey: [endpoint, params],
        queryFn: () => apiCall<TData>(endpoint, { params }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    },

    // Set data directly in cache
    setData: <TData = unknown>(
      queryKey: (string | number)[],
      data: TData | ((old: TData | undefined) => TData),
    ) => {
      queryClient.setQueryData(queryKey, data);
    },

    // Get data from cache
    getData: <TData = unknown>(queryKey: (string | number)[]) => {
      return queryClient.getQueryData<TData>(queryKey);
    },

    // Clear all cache
    clearAll: () => {
      queryClient.clear();
    },

    // Remove specific queries
    removeQueries: (queryKey: (string | number)[]) => {
      queryClient.removeQueries({ queryKey });
    },

    // Force refresh all queries
    refetchAll: () => {
      queryClient.refetchQueries();
    },

    // Get cache info
    getCacheInfo: () => {
      const queries = queryClient.getQueryCache().getAll();
      return {
        totalQueries: queries.length,
        queries: queries.map((query) => ({
          queryKey: query.queryKey,
          state: query.state,
          dataUpdatedAt: query.state.dataUpdatedAt,
        })),
      };
    },
  };
};

// Loading state manager for multiple queries
export const useLoadingStates = (queries: { isLoading: boolean }[]) => {
  const isAnyLoading = queries.some((query) => query.isLoading);
  const loadingCount = queries.filter((query) => query.isLoading).length;
  const totalCount = queries.length;
  const loadingPercentage = totalCount > 0 ? ((totalCount - loadingCount) / totalCount) * 100 : 100;

  return {
    isAnyLoading,
    loadingCount,
    totalCount,
    loadingPercentage,
    isAllLoaded: loadingCount === 0,
  };
};

// Form mutation with loading states
export const useFormMutation = <TData = unknown, TVariables = unknown>(
  endpoint: string,
  options?: {
    method?: 'POST' | 'PUT' | 'PATCH';
    showSuccessMessage?: boolean;
    successMessage?: string;
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
  },
) => {
  const {
    method = 'POST',
    showSuccessMessage = true,
    successMessage = 'Lưu thành công!',
    onSuccess,
    onError,
  } = options || {};

  return useApiMutation<TData, TVariables>({
    endpoint,
    method,
    onSuccess: (data, variables, context) => {
      if (showSuccessMessage) {
        // This will be handled by global success handler in QueryProvider
      }
      // propagate variables and context to caller if they need them
      // @ts-expect-error allow extra args for upstream consumers
      onSuccess?.(data, variables, context);
    },
    onError,
    // Pass context for global handlers
    meta: {
      showSuccessMessage,
      successMessage,
    },
  });
};
