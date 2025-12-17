import { buildUrl } from '@/@crema/helper/BuildUrl';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { usePut } from '@/@crema/hooks/useApiQuery';

// -------------------------
// Get all coaches
// -------------------------
export const useGetAllCoaches = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['coaches', params],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const url = buildUrl('coaches');
      const response = await axios.get(url, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params,
      });
      console.log('Coaches response:', response.data);
      return response.data;
    },
  });
};

// -------------------------
// Get a single coach by ID
// -------------------------
export const useGetCoachById = (id: string) => {
  console.log('Fetching coach with ID:', id);
  return useQuery({
    queryKey: ['coach', id],
    queryFn: async () => {
      if (!id) return null;
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const url = buildUrl(`coaches/${id}?isUser=false`);
      const response = await axios.get(url, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      console.log('Coach response:', response.data);
      return response.data;
    },
    enabled: !!id, // chỉ fetch khi có id
  });
};

// -------------------------
// Get overall rating of a coach
// -------------------------
export const useGetCoachRating = (id: string) => {
  return useQuery({
    queryKey: ['coachRating', id],
    queryFn: async () => {
      if (!id) return null;
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const url = buildUrl(`coaches/${id}/rating/overall`);
      const response = await axios.get(url, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return response.data;
    },
    enabled: !!id,
  });
};

// -------------------------
// Verify coach
// -------------------------
export const useVerifyCoach = () => {
  return usePut<any, { id: string }>('coaches/:id/verify', {
    onSuccess: () => {
      // Invalidate coaches list to refresh data
    },
  });
};

// -------------------------
// Reject coach
// -------------------------
export const useRejectCoach = () => {
  return usePut<any, { id: string; reason?: string }>('coaches/:id/reject', {
    onSuccess: () => {
      // Invalidate coaches list to refresh data
    },
  });
};
