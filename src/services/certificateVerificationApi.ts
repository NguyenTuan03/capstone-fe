import {
  CoachApplication,
  ApplicationStats,
  GetApplicationsParams,
  GetApplicationsResponse,
  ReviewApplicationRequest,
  CertificateReviewRequest,
  FilterOptions,
  ApiResponse,
  REJECTION_REASONS,
} from '@/types/certificate-verification';
import applicationsData from '@/data/coach-applications.json';

// Simulate API delay
const simulateDelay = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data
const allApplications = applicationsData.applications as CoachApplication[];
const filterOptions = applicationsData.filterOptions as FilterOptions;

export class CertificateVerificationApiService {
  /**
   * Get coach applications with pagination and filters
   */
  static async getApplications(params: GetApplicationsParams): Promise<GetApplicationsResponse> {
    await simulateDelay();

    let filteredApplications = [...allApplications];

    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredApplications = filteredApplications.filter(
        (app) =>
          app.applicant.name.toLowerCase().includes(searchTerm) ||
          app.applicant.email.toLowerCase().includes(searchTerm) ||
          app.applicant.phone.includes(searchTerm) ||
          app.id.toLowerCase().includes(searchTerm),
      );
    }

    // Apply status filter
    if (params.status && params.status !== 'all') {
      filteredApplications = filteredApplications.filter((app) => app.status === params.status);
    }

    // Apply priority filter
    if (params.priority && params.priority !== 'all') {
      filteredApplications = filteredApplications.filter((app) => app.priority === params.priority);
    }

    // Apply specialty filter
    if (params.specialty && params.specialty !== 'all') {
      const specialtyMap: { [key: string]: string } = {
        basic: 'Kỹ thuật cơ bản',
        advanced: 'Chiến thuật nâng cao',
        kids: 'Huấn luyện trẻ em',
        doubles: 'Thi đấu đôi',
        professional: 'Thi đấu chuyên nghiệp',
        injury: 'Phục hồi chấn thương',
      };

      const specialtyText = specialtyMap[params.specialty];
      if (specialtyText) {
        filteredApplications = filteredApplications.filter((app) =>
          app.professionalInfo.specialties.includes(specialtyText),
        );
      }
    }

    // Apply experience filter
    if (params.experience && params.experience !== 'all') {
      filteredApplications = filteredApplications.filter((app) => {
        const years = app.professionalInfo.yearsOfExperience;
        switch (params.experience) {
          case '1-2':
            return years >= 1 && years <= 2;
          case '3-5':
            return years >= 3 && years <= 5;
          case '6-10':
            return years >= 6 && years <= 10;
          case '10+':
            return years > 10;
          default:
            return true;
        }
      });
    }

    // Apply date range filter
    if (params.dateRange && params.dateRange.length === 2) {
      const [startDate, endDate] = params.dateRange;
      filteredApplications = filteredApplications.filter((app) => {
        const submitDate = new Date(app.submittedAt);
        return submitDate >= new Date(startDate) && submitDate <= new Date(endDate);
      });
    }

    // Apply sorting
    const sortBy = params.sortBy || 'submittedAt';
    const sortOrder = params.sortOrder || 'desc';

    filteredApplications.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.applicant.name;
          bValue = b.applicant.name;
          break;
        case 'experience':
          aValue = a.professionalInfo.yearsOfExperience;
          bValue = b.professionalInfo.yearsOfExperience;
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
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
    const total = filteredApplications.length;
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedApplications = filteredApplications.slice(startIndex, endIndex);

    // Calculate stats
    const stats = this.calculateStats(allApplications);

    return {
      applications: paginatedApplications,
      total,
      page: params.page,
      limit: params.limit,
      stats,
    };
  }

  /**
   * Get application by ID
   */
  static async getApplicationById(applicationId: string): Promise<CoachApplication | null> {
    await simulateDelay();

    const application = allApplications.find((app) => app.id === applicationId);
    return application || null;
  }

  /**
   * Review application (approve, reject, request info)
   */
  static async reviewApplication(request: ReviewApplicationRequest): Promise<ApiResponse> {
    await simulateDelay();

    try {
      console.log('Reviewing application:', request);

      let message = '';
      switch (request.action) {
        case 'approve':
          message = 'Đã duyệt đơn đăng ký huấn luyện viên thành công';
          break;
        case 'reject':
          message = 'Đã từ chối đơn đăng ký huấn luyện viên';
          break;
        case 'request_info':
          message = 'Đã yêu cầu ứng viên bổ sung thông tin';
          break;
      }

      return {
        success: true,
        message,
        data: {
          applicationId: request.applicationId,
          action: request.action,
          reviewedAt: new Date().toISOString(),
          reviewedBy: request.adminId,
          notes: request.notes,
          rejectionReason: request.rejectionReason,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể xử lý đánh giá đơn đăng ký',
      };
    }
  }

  /**
   * Review individual certificate
   */
  static async reviewCertificate(request: CertificateReviewRequest): Promise<ApiResponse> {
    await simulateDelay();

    try {
      console.log('Reviewing certificate:', request);

      const message =
        request.status === 'verified' ? 'Đã xác minh chứng chỉ thành công' : 'Đã từ chối chứng chỉ';

      return {
        success: true,
        message,
        data: {
          certificateId: request.certificateId,
          status: request.status,
          verifiedAt: new Date().toISOString(),
          verifiedBy: request.adminId,
          notes: request.notes,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể xử lý đánh giá chứng chỉ',
      };
    }
  }

  /**
   * Get filter options
   */
  static async getFilterOptions(): Promise<FilterOptions> {
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
   * Calculate application statistics
   */
  private static calculateStats(applications: CoachApplication[]): ApplicationStats {
    const total = applications.length;
    const pending = applications.filter((app) => app.status === 'pending').length;
    const underReview = applications.filter((app) => app.status === 'under_review').length;
    const approved = applications.filter((app) => app.status === 'approved').length;
    const rejected = applications.filter((app) => app.status === 'rejected').length;
    const requiresInfo = applications.filter((app) => app.status === 'requires_info').length;
    const urgentApplications = applications.filter((app) => app.priority === 'urgent').length;

    // Calculate average processing time for completed applications
    const completedApps = applications.filter(
      (app) => app.status === 'approved' || app.status === 'rejected',
    );

    let avgProcessingTime = 0;
    if (completedApps.length > 0) {
      const totalProcessingDays = completedApps.reduce((sum, app) => {
        if (app.reviewedAt) {
          const submitDate = new Date(app.submittedAt);
          const reviewDate = new Date(app.reviewedAt);
          const diffTime = Math.abs(reviewDate.getTime() - submitDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return sum + diffDays;
        }
        return sum;
      }, 0);

      avgProcessingTime = Math.round(totalProcessingDays / completedApps.length);
    }

    return {
      total,
      pending,
      underReview,
      approved,
      rejected,
      requiresInfo,
      avgProcessingTime,
      urgentApplications,
    };
  }

  /**
   * Update application priority
   */
  static async updateApplicationPriority(
    applicationId: string,
    priority: CoachApplication['priority'],
    adminId: string,
  ): Promise<ApiResponse> {
    await simulateDelay();

    try {
      console.log('Updating application priority:', { applicationId, priority, adminId });

      return {
        success: true,
        message: 'Đã cập nhật mức độ ưu tiên',
        data: {
          applicationId,
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
   * Add note to application
   */
  static async addApplicationNote(
    applicationId: string,
    note: string,
    adminId: string,
  ): Promise<ApiResponse> {
    await simulateDelay();

    try {
      console.log('Adding application note:', { applicationId, note, adminId });

      return {
        success: true,
        message: 'Đã thêm ghi chú thành công',
        data: {
          applicationId,
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
}
