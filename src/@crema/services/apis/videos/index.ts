import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { buildUrl } from '@/@crema/helper/BuildUrl';

export interface CreateVideoDto {
  title: string;
  description?: string;
  duration: number; // in seconds
  tags?: string[];
  drillName?: string;
  drillDescription?: string;
  drillPracticeSets?: string;
}

export interface CreateVideoForLessonPayload {
  lessonId: string | number;
  video: File;
  data: CreateVideoDto;
}

const getAuthToken = () => (typeof window !== 'undefined' && localStorage.getItem('token')) || '';

export const useCreateVideoForLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lessonId, video, data }: CreateVideoForLessonPayload) => {
      if (!lessonId) {
        throw new Error('Thiếu lessonId');
      }

      if (!video) {
        throw new Error('Vui lòng chọn file video');
      }

      const url = buildUrl(`videos/lessons/${lessonId}`);
      const token = getAuthToken();

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('video', video);
      formData.append('title', data.title);
      formData.append('duration', data.duration.toString());

      if (data.description) {
        formData.append('description', data.description);
      }

      if (data.tags && data.tags.length > 0) {
        data.tags.forEach((tag) => {
          formData.append('tags[]', tag);
        });
      }

      if (data.drillName) {
        formData.append('drillName', data.drillName);
      }

      if (data.drillDescription) {
        formData.append('drillDescription', data.drillDescription);
      }

      if (data.drillPracticeSets) {
        formData.append('drillPracticeSets', data.drillPracticeSets);
      }

      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['videos', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['lessons', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['videos', 'lesson', variables.lessonId] });
    },
  });
};

export interface GetVideosByLessonParams {
  lessonId: string | number;
}

export const useGetVideosByLesson = ({ lessonId }: GetVideosByLessonParams) => {
  return useQuery({
    queryKey: ['videos', 'lesson', lessonId],
    queryFn: async () => {
      if (!lessonId) {
        throw new Error('Thiếu lessonId');
      }

      const url = buildUrl(`videos/lessons/${lessonId}`);
      const token = getAuthToken();

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      return response.data;
    },
    enabled: Boolean(lessonId),
  });
};
