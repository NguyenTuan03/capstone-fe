import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { buildUrl } from '@/@crema/helper/BuildUrl';

export interface CreateQuestionOptionDto {
  content: string;
  isCorrect: boolean;
}

export interface CreateQuestionDto {
  title: string;
  explanation?: string;
  options?: CreateQuestionOptionDto[];
}

export interface CreateQuizDto {
  title: string;
  description?: string;
  questions?: CreateQuestionDto[];
}

const getAuthToken = () => (typeof window !== 'undefined' && localStorage.getItem('token')) || '';

export interface CreateQuizForLessonPayload {
  lessonId: string | number;
  quiz: CreateQuizDto;
}

export const useCreateQuizForLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lessonId, quiz }: CreateQuizForLessonPayload) => {
      if (!lessonId) {
        throw new Error('Thiếu lessonId');
      }

      const url = buildUrl(`quizzes/lessons/${lessonId}`);
      const token = getAuthToken();

      const response = await axios.post(url, quiz, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['lessons', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['quizzes', 'lesson', variables.lessonId] });
    },
  });
};

export interface GetQuizzesByLessonParams {
  lessonId: string | number;
}

export const useGetQuizzesByLesson = ({ lessonId }: GetQuizzesByLessonParams) => {
  return useQuery({
    queryKey: ['quizzes', 'lesson', lessonId],
    queryFn: async () => {
      if (!lessonId) {
        throw new Error('Thiếu lessonId');
      }

      const url = buildUrl(`quizzes/lessons/${lessonId}`);
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
