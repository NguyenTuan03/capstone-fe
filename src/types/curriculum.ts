import type { RequestWithContent, LessonWithDetails } from '@/@crema/services/apis/requests';

export interface VideoData {
  id: string;
  title: string;
  description: string;
  tags: string[];
  duration: number;
  drillName?: string;
  drillDescription?: string;
  drillPracticeSets?: string;
  publicUrl: string;
  thumbnailUrl?: string;
  status: string;
  coachName: string;
  coachEmail: string;
  coachAvatar: string;
  lessonName: string;
  courseName: string;
  createdAt?: string;
}

export interface CourseRequestData {
  id: string;
  courseName: string;
  courseDescription: string;
  level: string;
  status: string;
  coachName: string;
  coachEmail: string;
  coachAvatar: string;
  totalLessons: number;
  totalVideos: number;
  totalQuizzes: number;
  createdAt: string;
  requestData: RequestWithContent;
}

export { type RequestWithContent, type LessonWithDetails };
