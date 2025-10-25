export interface Chapter {
  id: string;
  name: string;
  description: string;
  order: number;
  status: 'active' | 'inactive';
  lessonsCount: number;
  totalDuration: number;
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
  duration: number;
  hasText: boolean;
  hasVideo: boolean;
  hasQuiz: boolean;
  textContent?: TextContent;
  videoContent?: VideoContent;
  quizzes: Quiz[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface TextContent {
  id: string;
  content: string;
  attachments: Attachment[];
  lastEditedAt: string;
  lastEditedBy: string;
}

export interface VideoContent {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  question: string;
  type: 'single_choice' | 'multiple_choice' | 'true_false';
  options: QuizOption[];
  correctAnswers: string[];
  explanation: string;
  order: number;
  points: number;
  timeLimit: number;
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
  type: string;
  size: number;
  uploadedAt: string;
}

export interface CurriculumStats {
  totalChapters: number;
  totalLessons: number;
  totalQuizzes: number;
  activeChapters: number;
  activeLessons: number;
  activeQuizzes: number;
  totalDuration: number;
  avgLessonsPerChapter: number;
  avgQuizzesPerLesson: number;
}

export interface GetChaptersParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  sortBy?: 'name' | 'lessonsCount' | 'createdAt' | 'order';
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
  status?: string;
  hasContent?: 'text' | 'video' | 'quiz' | 'all';
  sortBy?: 'name' | 'duration' | 'createdAt' | 'order';
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
  content: TextContent | VideoContent;
}

export interface CreateQuizRequest {
  lessonId: string;
  question: string;
  type: 'single_choice' | 'multiple_choice' | 'true_false';
  options: { text: string; order: number }[];
  correctAnswers: number[];
  explanation: string;
  points?: number;
  timeLimit?: number;
}

export interface UpdateQuizRequest {
  id: string;
  question?: string;
  type?: 'single_choice' | 'multiple_choice' | 'true_false';
  options?: { text: string; order: number }[];
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
    text?: boolean;
    video?: boolean;
    quiz?: boolean;
  };
}

export interface ReorderRequest {
  type: 'chapter' | 'lesson';
  items: { id: string; order: number }[];
}

export interface ActivityLog {
  id: string;
  type: 'create' | 'update' | 'delete' | 'status_change';
  entityType: 'chapter' | 'lesson' | 'quiz';
  entityId: string;
  entityName: string;
  action: string;
  details: any;
  userId: string;
  userName: string;
  timestamp: string;
}

export interface GetActivityLogsParams {
  page: number;
  limit: number;
  entityType?: string;
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

export interface CurriculumFilterOptions {
  statuses: Array<{ value: string; label: string }>;
  contentTypes: Array<{ value: string; label: string }>;
  quizTypes: Array<{ value: string; label: string }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}
