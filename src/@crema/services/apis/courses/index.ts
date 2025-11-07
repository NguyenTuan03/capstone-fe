import { buildUrl } from '@/@crema/helper/BuildUrl';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface CreateScheduleDto {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface CreateCourseRequestDto {
  learningFormat: string; // CourseLearningFormat
  minParticipants: number;
  maxParticipants: number;
  pricePerParticipant: number;
  startDate: Date | string;
  address: string;
  province: number;
  district: number;
  schedules?: CreateScheduleDto[];
}

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { subjectId: number | string; data: CreateCourseRequestDto }) => {
      const url = buildUrl(`courses/subjects/${payload.subjectId}`);
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
      // Invalidate all courses queries to refetch the list
      queryClient.invalidateQueries({ queryKey: ['courses', 'list'] });
      // Also invalidate any specific course queries if needed
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export interface GetCoursesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  level?: string;
  learningFormat?: string;
  status?: string;
}

export const useGetCourses = (params?: GetCoursesParams) => {
  return useQuery({
    queryKey: ['courses', 'list', params],
    queryFn: async () => {
      const url = buildUrl('courses');
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const res = await axios.get(url, {
        params: {
          page: params?.page || 1,
          pageSize: params?.pageSize || 10,
          ...(params?.search && { search: params.search }),
          ...(params?.level && { level: params.level }),
          ...(params?.learningFormat && { learningFormat: params.learningFormat }),
          ...(params?.status && { status: params.status }),
        },
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return res.data;
    },
  });
};
