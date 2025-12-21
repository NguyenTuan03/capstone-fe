import {
  Course,
  CourseStats,
  GetCoursesParams,
  GetCoursesResponse,
  ReviewCourseRequest,
  CourseFilterOptions,
  ApiResponse,
  REJECTION_REASONS,
  REQUIRED_CHANGES,
} from '@/types/course-verification';

export class CourseVerificationApiService {
  /**
   * Get courses with pagination and filters
   */
  static async getCourses(_params: GetCoursesParams): Promise<GetCoursesResponse> {
    void _params;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get course by ID
   */
  static async getCourseById(_courseId: string): Promise<Course | null> {
    void _courseId;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Review course (approve, reject, request changes)
   */
  static async reviewCourse(_request: ReviewCourseRequest): Promise<ApiResponse> {
    void _request;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get filter options
   */
  static async getFilterOptions(): Promise<CourseFilterOptions> {
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get rejection reasons
   */
  static async getRejectionReasons(): Promise<string[]> {
    return [...REJECTION_REASONS];
  }

  /**
   * Get required changes suggestions
   */
  static async getRequiredChanges(): Promise<string[]> {
    return [...REQUIRED_CHANGES];
  }

  /**
   * Update course priority
   */
  static async updateCoursePriority(
    _courseId: string,
    _priority: Course['priority'],
    _adminId: string,
  ): Promise<ApiResponse> {
    void _courseId;
    void _priority;
    void _adminId;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Add note to course
   */
  static async addCourseNote(
    _courseId: string,
    _note: string,
    _adminId: string,
  ): Promise<ApiResponse> {
    void _courseId;
    void _note;
    void _adminId;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Calculate course statistics
   */
  private static calculateStats(_courses: Course[]): CourseStats {
    void _courses;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Format currency
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
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
