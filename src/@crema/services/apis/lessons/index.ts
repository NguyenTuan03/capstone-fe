import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { buildUrl } from '@/@crema/helper/BuildUrl';

export interface CreateLessonDto {
  name: string;
  description?: string;
  duration?: number; // minutes
}

export interface UpdateLessonDto {
  name?: string;
  description?: string;
  duration?: number; // minutes
}

export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { subjectId: string | number; data: CreateLessonDto }) => {
      const url = buildUrl(`lessons/subjects/${payload.subjectId}`);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const res = await axios.post(url, payload.data, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lessons', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['lessons', 'subject'] });
      // Invalidate subject detail for the specific subject
      queryClient.invalidateQueries({ queryKey: ['subjects', 'detail', variables.subjectId] });
      queryClient.invalidateQueries({ queryKey: ['subjects', 'list'] });
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { lessonId: string | number; data: UpdateLessonDto }) => {
      const url = buildUrl(`lessons/${payload.lessonId}`);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const res = await axios.put(url, payload.data, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['lessons', 'subject'] });
      // Invalidate all subject details to refetch (since we don't know which subject)
      queryClient.invalidateQueries({ queryKey: ['subjects', 'detail'] });
      queryClient.invalidateQueries({ queryKey: ['subjects', 'list'] });
    },
  });
};

export interface GetLessonsParams {
  page?: number;
  size?: number;
  subjectId?: string | number;
}

export const useGetLessons = (params?: GetLessonsParams) => {
  return useQuery({
    queryKey: ['lessons', 'list', params],
    queryFn: async () => {
      const url = buildUrl('lessons');
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const res = await axios.get(url, {
        params,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return res.data;
    },
  });
};

export const useGetLessonsBySubject = (subjectId: string | number | null | undefined) => {
  return useQuery({
    queryKey: ['lessons', 'subject', subjectId],
    queryFn: async () => {
      if (!subjectId) {
        return { items: [], total: 0 };
      }
      const url = buildUrl(`lessons/subjects/${subjectId}`);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const res = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return res.data;
    },
    enabled: !!subjectId,
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lessonId: string | number) => {
      const url = buildUrl(`lessons/${lessonId}`);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const res = await axios.delete(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['lessons', 'subject'] });
      // Invalidate all subject details to refetch (since we don't know which subject)
      queryClient.invalidateQueries({ queryKey: ['subjects', 'detail'] });
      queryClient.invalidateQueries({ queryKey: ['subjects', 'list'] });
    },
  });
};
