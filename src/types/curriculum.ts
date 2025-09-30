// Curriculum Management Types

export interface Chapter {
  id: string;
  name: string;
  description: string;
  order: number;
  status: 'active' | 'inactive';
  lessonsCount: number;
  totalDuration: number; // in minutes
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  chapterName: string;
  name: string;
  shortDescription: string;
  order: number;
  status: 'active' | 'inactive';
  duration: number; // in minutes

  // Content flags
  hasText: boolean;
  hasVideo: boolean;
  hasQuiz: boolean;

  // Content
  textContent?: LessonTextContent;
  videoContent?: LessonVideoContent;
  quizzes: Quiz[];

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface LessonTextContent {
  id: string;
  content: string; // Rich text HTML
  attachments?: Attachment[];
  lastEditedAt: string;
  lastEditedBy: string;
}

export interface LessonVideoContent {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number; // in seconds
  fileSize?: number; // in bytes
  uploadedAt: string;
  uploadedBy: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  question: string;
  type: 'single_choice' | 'multiple_choice' | 'true_false';
  options: QuizOption[];
  correctAnswers: string[]; // option IDs
  explanation?: string;
  order: number;
  points: number;
  timeLimit?: number; // in seconds
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface QuizOption {
  id: string;
  text: string;
  order: number;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'link';
  size?: number;
  uploadedAt: string;
}

// Statistics
export interface CurriculumStats {
  totalChapters: number;
  totalLessons: number;
  totalQuizzes: number;
  activeChapters: number;
  activeLessons: number;
  activeQuizzes: number;
  totalDuration: number; // in minutes
  avgLessonsPerChapter: number;
  avgQuizzesPerLesson: number;
}

// API Request/Response Types
export interface GetChaptersParams {
  page: number;
  limit: number;
  search?: string;
  status?: 'all' | 'active' | 'inactive';
  sortBy?: 'name' | 'order' | 'createdAt' | 'lessonsCount';
  sortOrder?: 'asc' | 'desc';
}

export interface GetChaptersResponse {
  chapters: Chapter[];
  total: number;
  page: number;
  limit: number;
  stats: CurriculumStats;
}

export interface GetLessonsParams {
  page: number;
  limit: number;
  chapterId?: string;
  search?: string;
  status?: 'all' | 'active' | 'inactive';
  hasContent?: 'text' | 'video' | 'quiz' | 'all';
  sortBy?: 'name' | 'order' | 'createdAt' | 'duration';
  sortOrder?: 'asc' | 'desc';
}

export interface GetLessonsResponse {
  lessons: Lesson[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateChapterRequest {
  name: string;
  description: string;
  order?: number;
  status?: 'active' | 'inactive';
}

export interface UpdateChapterRequest {
  id: string;
  name?: string;
  description?: string;
  order?: number;
  status?: 'active' | 'inactive';
}

export interface CreateLessonRequest {
  chapterId: string;
  name: string;
  shortDescription: string;
  order?: number;
  status?: 'active' | 'inactive';
  duration?: number;
}

export interface UpdateLessonRequest {
  id: string;
  chapterId?: string;
  name?: string;
  shortDescription?: string;
  order?: number;
  status?: 'active' | 'inactive';
  duration?: number;
}

export interface UpdateLessonContentRequest {
  lessonId: string;
  type: 'text' | 'video';
  content: any;
}

export interface CreateQuizRequest {
  lessonId: string;
  question: string;
  type: 'single_choice' | 'multiple_choice' | 'true_false';
  options: Omit<QuizOption, 'id'>[];
  correctAnswers: number[]; // option indices
  explanation?: string;
  points?: number;
  timeLimit?: number;
}

export interface UpdateQuizRequest {
  id: string;
  question?: string;
  type?: 'single_choice' | 'multiple_choice' | 'true_false';
  options?: Omit<QuizOption, 'id'>[];
  correctAnswers?: number[];
  explanation?: string;
  points?: number;
  timeLimit?: number;
  status?: 'active' | 'inactive';
}

export interface DuplicateLessonRequest {
  lessonId: string;
  targetChapterId: string;
  newName?: string;
  includeContent?: {
    text: boolean;
    video: boolean;
    quiz: boolean;
  };
}

export interface ReorderRequest {
  type: 'chapter' | 'lesson' | 'quiz';
  items: { id: string; order: number }[];
}

// Activity Log
export interface ActivityLog {
  id: string;
  type: 'create' | 'update' | 'delete' | 'duplicate' | 'reorder' | 'status_change';
  entityType: 'chapter' | 'lesson' | 'quiz' | 'content';
  entityId: string;
  entityName: string;
  action: string;
  details?: any;
  userId: string;
  userName: string;
  timestamp: string;
}

export interface GetActivityLogsParams {
  page: number;
  limit: number;
  entityType?: 'chapter' | 'lesson' | 'quiz' | 'content' | 'all';
  entityId?: string;
  userId?: string;
  dateRange?: [string, string];
  sortOrder?: 'asc' | 'desc';
}

export interface GetActivityLogsResponse {
  logs: ActivityLog[];
  total: number;
  page: number;
  limit: number;
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Filter Options
export interface CurriculumFilterOptions {
  statuses: { value: string; label: string }[];
  contentTypes: { value: string; label: string }[];
  quizTypes: { value: string; label: string }[];
}

// Common Types
export type ContentType = 'text' | 'video' | 'quiz';
export type EntityType = 'chapter' | 'lesson' | 'quiz' | 'content';
export type ActionType = 'create' | 'update' | 'delete' | 'duplicate' | 'reorder' | 'status_change';
