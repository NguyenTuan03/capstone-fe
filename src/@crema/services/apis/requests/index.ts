import { buildUrl } from '@/@crema/helper/BuildUrl';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Helper function to get auth token
const getAuthToken = () => (typeof window !== 'undefined' && localStorage.getItem('token')) || '';

// TypeScript Interfaces
export interface RequestAction {
  id: number;
  type: string;
  comment: string;
  createdAt: string;
}

export interface RequestUser {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  role?: {
    id: number;
    name: string;
  };
  wallet?: {
    id: number;
    bankAccountNumber: string | null;
    currentBalance: string;
    totalIncome: string;
    createdAt: string;
    updatedAt: string;
    bank: any | null;
  };
}

export interface QuizOption {
  id: number;
  content: string;
  createdAt: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: number;
  title: string;
  options: QuizOption[];
  createdAt: string;
  explanation: string | null;
}

export interface Quiz {
  id: number;
  title: string;
  deletedAt: string | null;
  questions: QuizQuestion[];
  description: string;
  totalQuestions: number;
}

export interface Video {
  id: number;
  tags: string | null;
  title: string;
  status: string;
  duration: number;
  drillName: string;
  publicUrl: string;
  description: string;
  thumbnailUrl: string | null;
  drillDescription: string;
  drillPracticeSets: string;
}

export interface Lesson {
  id: number;
  name: string;
  quiz?: Quiz;
  video?: Video;
  duration: number;
  createdAt: string;
  deletedAt: string | null;
  updatedAt: string;
  description: string;
  lessonNumber: number;
}

export interface Subject {
  id: number;
  name: string;
  level: string;
  status: string;
  lessons: Lesson[];
  createdAt: string;
  deletedAt: string | null;
  publicUrl: string | null;
  updatedAt: string;
  description: string;
}

export interface Schedule {
  id: number;
  endTime: string;
  dayOfWeek: string;
  startTime: string;
  totalSessions: number;
}

export interface CourseDetails {
  id: number;
  name: string;
  court: {
    id: number;
  };
  level: string;
  status: string;
  endDate: string;
  subject: Subject;
  createdAt: string;
  createdBy: {
    id: number;
  };
  deletedAt: string | null;
  publicUrl: string | null;
  schedules: Schedule[];
  startDate: string;
  updatedAt: string;
  description: string;
  progressPct: number;
  totalEarnings: string;
  totalSessions: number;
  learningFormat: string;
  maxParticipants: number;
  minParticipants: number;
  cancellingReason: string | null;
  currentParticipants: number;
  pricePerParticipant: string;
}

export interface RequestMetadata {
  id: number;
  type: string;
  details: CourseDetails;
}

export interface Request {
  id: number;
  description: string;
  type: string;
  status: string;
  metadata: RequestMetadata;
  createdAt: string;
  updatedAt: string;
  createdBy: RequestUser;
  actions?: RequestAction[];
}

export interface GetRequestsResponse {
  items: Request[];
  page: number;
  pageSize: number;
  total: number;
}

export interface GetRequestsParams {
  page?: number;
  pageSize?: number;
  type?: string;
  status?: string;
}

// Extended interfaces for better data display
export interface LessonWithDetails extends Lesson {
  quiz?: Quiz;
  video?: Video;
}

export interface SubjectWithLessons extends Subject {
  lessons: LessonWithDetails[];
}

export interface CourseDetailsWithContent extends CourseDetails {
  subject: SubjectWithLessons;
}

export interface RequestWithContent extends Request {
  metadata: {
    id: number;
    type: string;
    details: CourseDetailsWithContent;
  };
}

// Helper functions for data transformation
export const transformLessonData = (lesson: Lesson): LessonWithDetails => {
  return {
    ...lesson,
    quiz: lesson.quiz || undefined,
    video: lesson.video || undefined,
  };
};

export const transformSubjectData = (subject: Subject | null | undefined): SubjectWithLessons => {
  if (!subject) {
    // Return a default subject with empty lessons
    return {
      id: 0,
      name: '',
      level: '',
      status: '',
      lessons: [],
      createdAt: '',
      deletedAt: null,
      publicUrl: null,
      updatedAt: '',
      description: '',
    };
  }
  return {
    ...subject,
    lessons: subject.lessons?.map(transformLessonData) || [],
  };
};

export const transformCourseDetails = (
  details: CourseDetails | null | undefined,
): CourseDetailsWithContent => {
  if (!details) {
    // Return a default course details object
    return {
      id: 0,
      name: '',
      court: { id: 0 },
      level: '',
      status: '',
      endDate: '',
      subject: {
        id: 0,
        name: '',
        level: '',
        status: '',
        lessons: [],
        createdAt: '',
        deletedAt: null,
        publicUrl: null,
        updatedAt: '',
        description: '',
      },
      createdAt: '',
      createdBy: { id: 0 },
      deletedAt: null,
      publicUrl: null,
      schedules: [],
      startDate: '',
      updatedAt: '',
      description: '',
      progressPct: 0,
      totalEarnings: '0',
      totalSessions: 0,
      learningFormat: '',
      maxParticipants: 0,
      minParticipants: 0,
      cancellingReason: null,
      currentParticipants: 0,
      pricePerParticipant: '0',
    };
  }
  return {
    ...details,
    subject: transformSubjectData(details.subject),
  };
};

export const transformRequestData = (request: Request): RequestWithContent => {
  return {
    ...request,
    metadata: {
      ...request.metadata,
      details: transformCourseDetails(request.metadata?.details),
    },
  };
};

// API Hooks
export const useGetRequests = (params?: GetRequestsParams) => {
  return useQuery({
    queryKey: ['requests', 'list', params],
    queryFn: async () => {
      const url = buildUrl('requests');
      const token = getAuthToken();

      const requestParams = {
        page: params?.page || 1,
        pageSize: params?.pageSize || 100,
        ...(params?.type && { type: params.type }),
        ...(params?.status && { status: params.status }),
        // Optimized for course approval requests with nested data
        include: 'metadata.details.subject.lessons.quiz,metadata.details.subject.lessons.video',
        populate:
          'metadata.details.subject.lessons.quiz.questions,metadata.details.subject.lessons.video',
      };

      const response = await axios.get<GetRequestsResponse>(url, {
        params: requestParams,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      console.log('Response data:', response.data);

      // Transform data for easier consumption
      const transformedData = {
        ...response.data,
        items: response.data.items.map(transformRequestData),
      };

      return transformedData;
    },
  });
};

export const useGetRequestById = (id: string | number) => {
  return useQuery({
    queryKey: ['requests', 'detail', id],
    queryFn: async () => {
      if (!id) throw new Error('Request ID is required');

      const url = buildUrl(`requests/${id}`);
      const token = getAuthToken();

      const response = await axios.get<Request>(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params: {
          include: 'metadata.details.subject.lessons.quiz,metadata.details.subject.lessons.video',
          populate:
            'metadata.details.subject.lessons.quiz.questions,metadata.details.subject.lessons.video',
        },
      });

      return transformRequestData(response.data);
    },
    enabled: Boolean(id),
  });
};

export const useApproveRequest = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(`courses/requests/${id}/approve`);
      const token = getAuthToken();

      const response = await axios.patch(
        url,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      return response.data;
    },
  });
};

export interface RejectRequestParams {
  id: number;
  reason: string;
}

export const useRejectRequest = () => {
  return useMutation({
    mutationFn: async ({ id, reason }: RejectRequestParams) => {
      const url = buildUrl(`courses/requests/${id}/reject`);
      const token = getAuthToken();

      const response = await axios.patch(
        url,
        { reason },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      return response.data;
    },
  });
};

// Additional hooks for specific data access
export const useGetCourseLessons = (requestId: string | number) => {
  const { data: request, ...rest } = useGetRequestById(requestId);

  const lessons = request?.metadata.details.subject.lessons || [];

  return {
    ...rest,
    data: lessons,
    request,
  };
};

export const useGetLessonDetails = (requestId: string | number, lessonId: number) => {
  const { data: lessons, ...rest } = useGetCourseLessons(requestId);

  const lesson = lessons?.find((l) => l.id === lessonId);

  return {
    ...rest,
    data: lesson,
    lessons,
  };
};

// Utility functions for UI display
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} phút`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours} giờ ${remainingMinutes} phút` : `${hours} giờ`;
};

export const getVideoThumbnail = (video: Video): string => {
  return video.thumbnailUrl || '/images/default-video-thumbnail.jpg';
};

export const getQuizStats = (quiz: Quiz) => {
  const totalQuestions = quiz.questions?.length || 0;
  const totalOptions =
    quiz.questions?.reduce((sum, question) => sum + (question.options?.length || 0), 0) || 0;

  return {
    totalQuestions,
    totalOptions,
    hasQuestions: totalQuestions > 0,
  };
};

export const getLessonStats = (lesson: LessonWithDetails) => {
  const videoDuration = lesson.video?.duration || 0;
  const quizStats = lesson.quiz
    ? getQuizStats(lesson.quiz)
    : { totalQuestions: 0, totalOptions: 0, hasQuestions: false };

  return {
    videoDuration: formatDuration(videoDuration),
    hasVideo: !!lesson.video,
    hasQuiz: !!lesson.quiz,
    quizStats,
    totalDuration: formatDuration(lesson.duration),
  };
};
