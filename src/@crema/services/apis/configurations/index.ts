import { usePost, usePut, useGet } from '@/@crema/hooks/useApiQuery';
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
// ✅ NEW - GET Configuration by Key
// ============================================
// GET /api/v1/configurations/{key}
export const useGetConfigurationByKey = (key: string, enabled = true) => {
  return useGet<ApiResponse<Configuration>>(key ? `configurations/${key}` : '', undefined, {
    enabled: enabled && !!key,
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
      onSuccess: () => {
        // Luôn hiển thị message tiếng Việt
        message.success('Cập nhật cấu hình thành công!');
      },
      onError: () => {
        // Luôn hiển thị message tiếng Việt
        message.error('Cập nhật cấu hình thất bại!');
      },
    },
  );
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
