import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { buildUrl } from '@/@crema/helper/BuildUrl';

export interface CreateLessonDto {
  name: string;
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', 'list'] });
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
