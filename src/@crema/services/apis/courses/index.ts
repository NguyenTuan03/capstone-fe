import { buildUrl } from '@/@crema/helper/BuildUrl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
      queryClient.invalidateQueries({ queryKey: ['courses', 'list'] });
    },
  });
};
