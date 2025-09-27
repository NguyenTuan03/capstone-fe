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
import coursesData from '@/data/course-verification.json';

// Simulate API delay
const simulateDelay = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data
const allCourses = coursesData.courses as Course[];
const filterOptions = coursesData.filterOptions as CourseFilterOptions;

export class CourseVerificationApiService {
  /**
   * Get courses with pagination and filters
   */
  static async getCourses(params: GetCoursesParams): Promise<GetCoursesResponse> {
    await simulateDelay();

    let filteredCourses = [...allCourses];

    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm) ||
          course.coach.name.toLowerCase().includes(searchTerm) ||
          course.category.toLowerCase().includes(searchTerm) ||
          course.id.toLowerCase().includes(searchTerm),
      );
    }

    // Apply status filter
    if (params.status && params.status !== 'all') {
      filteredCourses = filteredCourses.filter((course) => course.status === params.status);
    }

    // Apply priority filter
    if (params.priority && params.priority !== 'all') {
      filteredCourses = filteredCourses.filter((course) => course.priority === params.priority);
    }

    // Apply category filter
    if (params.category && params.category !== 'all') {
      const categoryMap: { [key: string]: string } = {
        basic: 'Kỹ thuật cơ bản',
        advanced: 'Chiến thuật nâng cao',
        doubles: 'Thi đấu đôi',
        singles: 'Thi đấu đơn',
        kids: 'Huấn luyện trẻ em',
        injury: 'Phục hồi chấn thương',
        fitness: 'Thể lực và sức bền',
        mental: 'Mental Training',
        tournament: 'Tournament Preparation',
      };

      const categoryText = categoryMap[params.category];
      if (categoryText) {
        filteredCourses = filteredCourses.filter((course) => course.category === categoryText);
      }
    }

    // Apply level filter
    if (params.level && params.level !== 'all') {
      filteredCourses = filteredCourses.filter((course) => course.level === params.level);
    }

    // Apply coach filter
    if (params.coachId) {
      filteredCourses = filteredCourses.filter((course) => course.coach.id === params.coachId);
    }

    // Apply price range filter
    if (params.minPrice !== undefined) {
      filteredCourses = filteredCourses.filter((course) => course.currentPrice >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      filteredCourses = filteredCourses.filter((course) => course.currentPrice <= params.maxPrice!);
    }

    // Apply date range filter
    if (params.dateRange && params.dateRange.length === 2) {
      const [startDate, endDate] = params.dateRange;
      filteredCourses = filteredCourses.filter((course) => {
        const submitDate = new Date(course.submittedAt);
        return submitDate >= new Date(startDate) && submitDate <= new Date(endDate);
      });
    }

    // Apply sorting
    const sortBy = params.sortBy || 'submittedAt';
    const sortOrder = params.sortOrder || 'desc';

    filteredCourses.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'price':
          aValue = a.currentPrice;
          bValue = b.currentPrice;
          break;
        case 'students':
          aValue = a.stats.enrolledStudents;
          bValue = b.stats.enrolledStudents;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'submittedAt':
        default:
          aValue = new Date(a.submittedAt).getTime();
          bValue = new Date(b.submittedAt).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Calculate pagination
    const total = filteredCourses.length;
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    // Calculate stats
    const stats = this.calculateStats(allCourses);

    return {
      courses: paginatedCourses,
      total,
      page: params.page,
      limit: params.limit,
      stats,
    };
  }

  /**
   * Get course by ID
   */
  static async getCourseById(courseId: string): Promise<Course | null> {
    await simulateDelay();

    const course = allCourses.find((c) => c.id === courseId);
    return course || null;
  }

  /**
   * Review course (approve, reject, request changes)
   */
  static async reviewCourse(request: ReviewCourseRequest): Promise<ApiResponse> {
    await simulateDelay();

    try {
      console.log('Reviewing course:', request);

      let message = '';
      switch (request.action) {
        case 'approve':
          message = request.publishImmediately
            ? 'Đã duyệt và xuất bản khóa học thành công'
            : 'Đã duyệt khóa học thành công';
          break;
        case 'reject':
          message = 'Đã từ chối khóa học';
          break;
        case 'request_changes':
          message = 'Đã yêu cầu huấn luyện viên chỉnh sửa khóa học';
          break;
      }

      return {
        success: true,
        message,
        data: {
          courseId: request.courseId,
          action: request.action,
          reviewedAt: new Date().toISOString(),
          reviewedBy: request.adminId,
          notes: request.notes,
          rejectionReason: request.rejectionReason,
          requiredChanges: request.requiredChanges,
          publishImmediately: request.publishImmediately,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể xử lý đánh giá khóa học',
      };
    }
  }

  /**
   * Get filter options
   */
  static async getFilterOptions(): Promise<CourseFilterOptions> {
    await simulateDelay(200);

    return filterOptions;
  }

  /**
   * Get rejection reasons
   */
  static async getRejectionReasons(): Promise<string[]> {
    await simulateDelay(200);

    return [...REJECTION_REASONS];
  }

  /**
   * Get required changes options
   */
  static async getRequiredChanges(): Promise<string[]> {
    await simulateDelay(200);

    return [...REQUIRED_CHANGES];
  }

  /**
   * Calculate course statistics
   */
  private static calculateStats(courses: Course[]): CourseStats {
    const total = courses.length;
    const pending = courses.filter((c) => c.status === 'pending_review').length;
    const approved = courses.filter((c) => c.status === 'approved').length;
    const rejected = courses.filter((c) => c.status === 'rejected').length;
    const draft = courses.filter((c) => c.status === 'draft').length;
    const requiresChanges = courses.filter((c) => c.status === 'requires_changes').length;

    const totalRevenue = courses
      .filter((c) => c.status === 'approved')
      .reduce((sum, c) => sum + c.stats.revenue, 0);

    const totalStudents = courses
      .filter((c) => c.status === 'approved')
      .reduce((sum, c) => sum + c.stats.enrolledStudents, 0);

    // Calculate average rating for approved courses with ratings
    const coursesWithRatings = courses.filter(
      (c) => c.status === 'approved' && c.stats.totalReviews > 0,
    );
    const averageRating =
      coursesWithRatings.length > 0
        ? coursesWithRatings.reduce((sum, c) => sum + c.stats.averageRating, 0) /
          coursesWithRatings.length
        : 0;

    // Calculate average completion rate for approved courses
    const approvedCourses = courses.filter((c) => c.status === 'approved');
    const completionRate =
      approvedCourses.length > 0
        ? approvedCourses.reduce((sum, c) => sum + c.stats.completionRate, 0) /
          approvedCourses.length
        : 0;

    const urgentReviews = courses.filter(
      (c) =>
        c.priority === 'urgent' &&
        (c.status === 'pending_review' || c.status === 'requires_changes'),
    ).length;

    // Calculate average review time for completed reviews
    const reviewedCourses = courses.filter(
      (c) => c.status === 'approved' || c.status === 'rejected',
    );

    let avgReviewTime = 0;
    if (reviewedCourses.length > 0) {
      const totalReviewDays = reviewedCourses.reduce((sum, c) => {
        if (c.reviewedAt) {
          const submitDate = new Date(c.submittedAt);
          const reviewDate = new Date(c.reviewedAt);
          const diffTime = Math.abs(reviewDate.getTime() - submitDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return sum + diffDays;
        }
        return sum;
      }, 0);

      avgReviewTime = Math.round(totalReviewDays / reviewedCourses.length);
    }

    return {
      total,
      pending,
      approved,
      rejected,
      draft,
      requiresChanges,
      totalRevenue,
      totalStudents,
      averageRating: Math.round(averageRating * 10) / 10,
      completionRate: Math.round(completionRate),
      urgentReviews,
      avgReviewTime,
    };
  }

  /**
   * Update course priority
   */
  static async updateCoursePriority(
    courseId: string,
    priority: Course['priority'],
    adminId: string,
  ): Promise<ApiResponse> {
    await simulateDelay();

    try {
      console.log('Updating course priority:', { courseId, priority, adminId });

      return {
        success: true,
        message: 'Đã cập nhật mức độ ưu tiên',
        data: {
          courseId,
          priority,
          updatedAt: new Date().toISOString(),
          updatedBy: adminId,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể cập nhật mức độ ưu tiên',
      };
    }
  }

  /**
   * Add note to course
   */
  static async addCourseNote(
    courseId: string,
    note: string,
    adminId: string,
  ): Promise<ApiResponse> {
    await simulateDelay();

    try {
      console.log('Adding course note:', { courseId, note, adminId });

      return {
        success: true,
        message: 'Đã thêm ghi chú thành công',
        data: {
          courseId,
          note,
          addedAt: new Date().toISOString(),
          addedBy: adminId,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể thêm ghi chú',
      };
    }
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

  /**
   * Get level badge color
   */
  static getLevelColor(level: string): string {
    switch (level) {
      case 'beginner':
        return 'green';
      case 'intermediate':
        return 'blue';
      case 'advanced':
        return 'orange';
      case 'all_levels':
        return 'purple';
      default:
        return 'default';
    }
  }

  /**
   * Get status badge color
   */
  static getStatusColor(status: string): string {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending_review':
        return 'processing';
      case 'rejected':
        return 'error';
      case 'requires_changes':
        return 'warning';
      case 'draft':
        return 'default';
      default:
        return 'default';
    }
  }

  /**
   * Get priority badge color
   */
  static getPriorityColor(priority: string): string {
    switch (priority) {
      case 'urgent':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'blue';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  }
}
