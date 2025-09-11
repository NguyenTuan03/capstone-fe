export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type PaginatedAPIResponse<T> = {
  data: T;
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
};

export interface ApiOptions<Body> {
  params?: any;
  payload?: Body | FormData;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  updateUrl?: string;
  hideError?: boolean;
}
