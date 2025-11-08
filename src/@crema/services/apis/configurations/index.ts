/**
 * Configuration API Service
 * Handles CRUD operations for system configurations
 */

import { usePost, usePut, useDelete, useGet } from '@/@crema/hooks/useApiQuery';
import {
  Configuration,
  CreateConfigurationDto,
  UpdateConfigurationDto,
  GetConfigurationsResponse,
  ApiResponse,
} from '@/types/configuration';
import { App } from 'antd';

// ============================================
// GET - List Configurations
// ============================================
export const useGetConfigurations = (params?: Record<string, any>) => {
  return useGet<GetConfigurationsResponse>('configurations', params);
};

// ============================================
// GET - Configuration Detail by ID
// ============================================
export const useGetConfigurationById = (id: number | string, enabled = true) => {
  return useGet<ApiResponse<Configuration>>(id ? `configurations/${id}` : '', undefined, {
    enabled: enabled && !!id,
  });
};

// ============================================
// POST - Create Configuration
// ============================================
export const useCreateConfiguration = () => {
  const { message } = App.useApp();

  return usePost<ApiResponse<Configuration>, CreateConfigurationDto>('configurations', {
    onSuccess: (data) => {
      message.success(data?.message || 'Tạo cấu hình thành công!');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Tạo cấu hình thất bại!';
      message.error(errorMessage);
    },
  });
};

// ============================================
// PUT - Update Configuration
// ============================================
export const useUpdateConfiguration = () => {
  const { message } = App.useApp();

  return usePut<ApiResponse<Configuration>, UpdateConfigurationDto & { id: number | string }>(
    'configurations/:id',
    {
      onSuccess: (data) => {
        message.success(data?.message || 'Cập nhật cấu hình thành công!');
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Cập nhật cấu hình thất bại!';
        message.error(errorMessage);
      },
    },
  );
};

// ============================================
// DELETE - Delete Configuration
// ============================================
export const useDeleteConfiguration = () => {
  const { message } = App.useApp();

  return useDelete<ApiResponse<void>, { id: number | string }>('configurations/:id', {
    onSuccess: (data) => {
      message.success(data?.message || 'Xóa cấu hình thành công!');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Xóa cấu hình thất bại!';
      message.error(errorMessage);
    },
  });
};

// ============================================
// Helper function to parse value based on dataType
// ============================================
export const parseConfigValue = (value: string, dataType: string): any => {
  switch (dataType) {
    case 'number':
      return Number(value);
    case 'boolean':
      return value === 'true' || value === '1';
    case 'json':
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    case 'string':
    default:
      return value;
  }
};

// ============================================
// Helper function to stringify value based on dataType
// ============================================
export const stringifyConfigValue = (value: any, dataType: string): string => {
  switch (dataType) {
    case 'json':
      return typeof value === 'string' ? value : JSON.stringify(value);
    case 'boolean':
      return String(value);
    case 'number':
      return String(value);
    case 'string':
    default:
      return String(value);
  }
};
