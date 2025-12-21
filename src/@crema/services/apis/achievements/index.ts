import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import jwtAxios from '@/@crema/services/jwt-auth';
import { message } from 'antd';

// ============================================
// API TYPES
// ============================================

export interface EventNameOption {
  value: string;
  label: string;
}

export interface EventNamesResponse {
  eventNames: EventNameOption[];
}

export interface CreateEventCountAchievementDto {
  name: string;
  description?: string;
  icon?: File; // File upload
  isActive?: boolean;
  eventName: string;
  targetCount: number;
}

export interface CreateStreakAchievementDto {
  name: string;
  description?: string;
  icon?: File; // File upload
  isActive?: boolean;
  eventName: string;
  targetStreakLength: number;
  streakUnit: string;
}

export interface CreatePropertyCheckAchievementDto {
  name: string;
  description?: string;
  icon?: File; // File upload
  isActive?: boolean;
  eventName: string;
  entityName: string;
  propertyName: string;
  comparisonOperator: string;
  targetValue: string;
}

export interface UpdateEventCountAchievementDto {
  name: string;
  description?: string;
  icon?: File; // File upload
  isActive?: boolean;
  eventName: string;
  targetCount: number;
}

export interface UpdateStreakAchievementDto {
  name: string;
  description?: string;
  icon?: File; // File upload
  isActive?: boolean;
  eventName: string;
  targetStreakLength: number;
  streakUnit: string;
}

export interface UpdatePropertyCheckAchievementDto {
  name: string;
  description?: string;
  icon?: File; // File upload
  isActive?: boolean;
  eventName: string;
  entityName: string;
  propertyName: string;
  comparisonOperator: string;
  targetValue: string;
}

// ============================================
// API HOOKS
// ============================================

/**
 * Hook to get list of event names
 * GET /api/v1/achievements/event-names
 */
export const useGetEventNames = () => {
  return useQuery({
    queryKey: ['achievements', 'event-names'],
    queryFn: async () => {
      const response = await jwtAxios.get<EventNamesResponse>('achievements/event-names');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

/**
 * Hook to create EVENT_COUNT achievement
 * POST /api/v1/achievements/event-count
 */
export const useCreateEventCountAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEventCountAchievementDto) => {
      // Tạo FormData để upload file
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      formData.append('eventName', data.eventName);
      formData.append('targetCount', data.targetCount.toString());
      formData.append('isActive', data.isActive !== undefined ? data.isActive.toString() : 'true');
      if (data.icon) formData.append('icon', data.icon);

      // jwtAxios tự động thêm token vào header
      const response = await jwtAxios.post('achievements/event-count', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      message.success('Tạo thành tựu EVENT_COUNT thành công!');
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.message || error.message || 'Tạo thành tựu thất bại';
      message.error(errorMsg);
    },
  });
};

/**
 * Hook to create STREAK achievement
 * POST /api/v1/achievements/streak
 */
export const useCreateStreakAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStreakAchievementDto) => {
      // Tạo FormData để upload file
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      formData.append('eventName', data.eventName);
      formData.append('targetStreakLength', data.targetStreakLength.toString());
      formData.append('streakUnit', data.streakUnit);
      formData.append('isActive', data.isActive !== undefined ? data.isActive.toString() : 'true');
      if (data.icon) formData.append('icon', data.icon);

      // jwtAxios tự động thêm token vào header
      const response = await jwtAxios.post('achievements/streak', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      message.success('Tạo thành tựu STREAK thành công!');
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.message || error.message || 'Tạo thành tựu thất bại';
      message.error(errorMsg);
    },
  });
};

/**
 * Hook to create PROPERTY_CHECK achievement
 * POST /api/v1/achievements/property-check
 */
export const useCreatePropertyCheckAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePropertyCheckAchievementDto) => {
      // Tạo FormData để upload file
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      formData.append('eventName', data.eventName);
      formData.append('entityName', data.entityName);
      formData.append('propertyName', data.propertyName);
      formData.append('comparisonOperator', data.comparisonOperator);
      formData.append('targetValue', data.targetValue);
      formData.append('isActive', data.isActive !== undefined ? data.isActive.toString() : 'true');
      if (data.icon) formData.append('icon', data.icon);

      // jwtAxios tự động thêm token vào header
      const response = await jwtAxios.post('achievements/property-check', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      message.success('Tạo thành tựu PROPERTY_CHECK thành công!');
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.message || error.message || 'Tạo thành tựu thất bại';
      message.error(errorMsg);
    },
  });
};

/**
 * Hook to delete achievement
 * DELETE /api/v1/achievements/{id}
 */
export const useDeleteAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const endpoint = `achievements/${id}`;
      console.log('🌐 DELETE API endpoint:', endpoint);
      console.log('🔑 Token:', jwtAxios.defaults.headers.common.Authorization);

      // jwtAxios tự động thêm token vào header
      const response = await jwtAxios.delete(endpoint);
      console.log('📦 DELETE Response:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      message.success('Xóa thành tựu thành công!');
    },
    onError: (error: any) => {
      console.error('❌ DELETE Error Details:', {
        message: error?.response?.data?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      const errorMsg = error?.response?.data?.message || error.message || 'Xóa thành tựu thất bại';
      message.error(errorMsg);
    },
  });
};

/**
 * Hook to activate achievement
 * PATCH /api/v1/achievements/{id}/activate
 */
export const useActivateAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const endpoint = `achievements/${id}/activate`;
      console.log('🌐 PATCH API endpoint (ACTIVATE):', endpoint);
      console.log('🔑 Token:', jwtAxios.defaults.headers.common.Authorization);

      const response = await jwtAxios.patch(endpoint);
      console.log('📦 ACTIVATE Response:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      message.success('Đã kích hoạt thành tựu thành công!');
    },
    onError: (error: any) => {
      console.error('❌ ACTIVATE Error Details:', {
        message: error?.response?.data?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      const errorMsg =
        error?.response?.data?.message || error.message || 'Kích hoạt thành tựu thất bại';
      message.error(errorMsg);
    },
  });
};

/**
 * Hook to deactivate achievement
 * PATCH /api/v1/achievements/{id}/deactivate
 */
export const useDeactivateAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const endpoint = `achievements/${id}/deactivate`;
      console.log('🌐 PATCH API endpoint (DEACTIVATE):', endpoint);
      console.log('🔑 Token:', jwtAxios.defaults.headers.common.Authorization);

      const response = await jwtAxios.patch(endpoint);
      console.log('📦 DEACTIVATE Response:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      message.success('Đã vô hiệu hóa thành tựu thành công!');
    },
    onError: (error: any) => {
      console.error('❌ DEACTIVATE Error Details:', {
        message: error?.response?.data?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      const errorMsg =
        error?.response?.data?.message || error.message || 'Vô hiệu hóa thành tựu thất bại';
      message.error(errorMsg);
    },
  });
};

/**
 * Hook to update EVENT_COUNT achievement
 * PUT /api/v1/achievements/event-count/{id}
 */
export const useUpdateEventCountAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string | number;
      data: UpdateEventCountAchievementDto;
    }) => {
      const endpoint = `achievements/event-count/${id}`;
      console.log('🌐 PUT API endpoint (UPDATE EVENT_COUNT):', endpoint);
      console.log('📝 Update data:', data);

      // Tạo FormData để upload file
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      formData.append('eventName', data.eventName);
      formData.append('targetCount', data.targetCount.toString());
      formData.append('isActive', data.isActive !== undefined ? data.isActive.toString() : 'true');
      if (data.icon) formData.append('icon', data.icon);

      const response = await jwtAxios.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('📦 UPDATE Response:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      message.success('Cập nhật thành tựu EVENT_COUNT thành công!');
    },
    onError: (error: any) => {
      console.error('❌ UPDATE Error Details:', {
        message: error?.response?.data?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      const errorMsg =
        error?.response?.data?.message || error.message || 'Cập nhật thành tựu thất bại';
      message.error(errorMsg);
    },
  });
};

/**
 * Hook to update STREAK achievement
 * PUT /api/v1/achievements/streak/{id}
 */
export const useUpdateStreakAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: UpdateStreakAchievementDto }) => {
      const endpoint = `achievements/streak/${id}`;
      console.log('🌐 PUT API endpoint (UPDATE STREAK):', endpoint);
      console.log('📝 Update data:', data);

      // Tạo FormData để upload file
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      formData.append('eventName', data.eventName);
      formData.append('targetStreakLength', data.targetStreakLength.toString());
      formData.append('streakUnit', data.streakUnit);
      formData.append('isActive', data.isActive !== undefined ? data.isActive.toString() : 'true');
      if (data.icon) formData.append('icon', data.icon);

      const response = await jwtAxios.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('📦 UPDATE Response:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      message.success('Cập nhật thành tựu STREAK thành công!');
    },
    onError: (error: any) => {
      console.error('❌ UPDATE Error Details:', {
        message: error?.response?.data?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      const errorMsg =
        error?.response?.data?.message || error.message || 'Cập nhật thành tựu thất bại';
      message.error(errorMsg);
    },
  });
};

/**
 * Hook to update PROPERTY_CHECK achievement
 * PUT /api/v1/achievements/property-check/{id}
 */
export const useUpdatePropertyCheckAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string | number;
      data: UpdatePropertyCheckAchievementDto;
    }) => {
      const endpoint = `achievements/property-check/${id}`;
      console.log('🌐 PUT API endpoint (UPDATE PROPERTY_CHECK):', endpoint);
      console.log('📝 Update data:', data);

      // Tạo FormData để upload file
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      formData.append('eventName', data.eventName);
      formData.append('entityName', data.entityName);
      formData.append('propertyName', data.propertyName);
      formData.append('comparisonOperator', data.comparisonOperator);
      formData.append('targetValue', data.targetValue);
      formData.append('isActive', data.isActive !== undefined ? data.isActive.toString() : 'true');
      if (data.icon) formData.append('icon', data.icon);

      const response = await jwtAxios.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('📦 UPDATE Response:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      message.success('Cập nhật thành tựu PROPERTY_CHECK thành công!');
    },
    onError: (error: any) => {
      console.error('❌ UPDATE Error Details:', {
        message: error?.response?.data?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      const errorMsg =
        error?.response?.data?.message || error.message || 'Cập nhật thành tựu thất bại';
      message.error(errorMsg);
    },
  });
};
