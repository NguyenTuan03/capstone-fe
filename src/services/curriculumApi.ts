import {
  Chapter,
  Lesson,
  Quiz,
  CurriculumStats,
  GetChaptersParams,
  GetChaptersResponse,
  GetLessonsParams,
  GetLessonsResponse,
  CreateChapterRequest,
  UpdateChapterRequest,
  CreateLessonRequest,
  UpdateLessonRequest,
  UpdateLessonContentRequest,
  CreateQuizRequest,
  UpdateQuizRequest,
  DuplicateLessonRequest,
  ReorderRequest,
  ActivityLog,
  GetActivityLogsParams,
  GetActivityLogsResponse,
  CurriculumFilterOptions,
  ApiResponse,
} from '@/@crema/types/models/curriculum';

export class CurriculumApiService {
  /**
   * Get chapters with pagination and filters
   */
  static async getChapters(_params: GetChaptersParams): Promise<GetChaptersResponse> {
    void _params;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get lessons with pagination and filters
   */
  static async getLessons(_params: GetLessonsParams): Promise<GetLessonsResponse> {
    void _params;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get chapter by ID
   */
  static async getChapterById(_id: string): Promise<Chapter | null> {
    void _id;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get lesson by ID
   */
  static async getLessonById(_id: string): Promise<Lesson | null> {
    void _id;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Create chapter
   */
  static async createChapter(_request: CreateChapterRequest): Promise<ApiResponse<Chapter>> {
    void _request;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Update chapter
   */
  static async updateChapter(_request: UpdateChapterRequest): Promise<ApiResponse<Chapter>> {
    void _request;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Delete chapter
   */
  static async deleteChapter(_id: string): Promise<ApiResponse> {
    void _id;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Create lesson
   */
  static async createLesson(_request: CreateLessonRequest): Promise<ApiResponse<Lesson>> {
    void _request;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Update lesson
   */
  static async updateLesson(_request: UpdateLessonRequest): Promise<ApiResponse<Lesson>> {
    void _request;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Delete lesson
   */
  static async deleteLesson(_id: string): Promise<ApiResponse> {
    void _id;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Update lesson content
   */
  static async updateLessonContent(_request: UpdateLessonContentRequest): Promise<ApiResponse> {
    void _request;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Create quiz
   */
  static async createQuiz(_request: CreateQuizRequest): Promise<ApiResponse<Quiz>> {
    void _request;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Update quiz
   */
  static async updateQuiz(_request: UpdateQuizRequest): Promise<ApiResponse<Quiz>> {
    void _request;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Delete quiz
   */
  static async deleteQuiz(_id: string): Promise<ApiResponse> {
    void _id;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Duplicate lesson
   */
  static async duplicateLesson(_request: DuplicateLessonRequest): Promise<ApiResponse<Lesson>> {
    void _request;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Reorder items
   */
  static async reorderItems(_request: ReorderRequest): Promise<ApiResponse> {
    void _request;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get activity logs
   */
  static async getActivityLogs(_params: GetActivityLogsParams): Promise<GetActivityLogsResponse> {
    void _params;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get filter options
   */
  static async getFilterOptions(): Promise<CurriculumFilterOptions> {
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Calculate stats
   */
  static calculateStats(): CurriculumStats {
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Add activity log
   */
  static addActivityLog(_log: ActivityLog): void {
    void _log;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Format duration
   */
  static formatDuration(minutes: number): string {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins} phút`;
    if (mins === 0) return `${hrs} giờ`;
    return `${hrs} giờ ${mins} phút`;
  }

  /**
   * Format date
   */
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  /**
   * Format datetime
   */
  static formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
