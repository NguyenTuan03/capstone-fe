import {
  CoachApplication,
  FilterOptions,
  GetApplicationsParams,
  GetApplicationsResponse,
  ReviewApplicationRequest,
  CertificateReviewRequest,
  ApiResponse,
  ApplicationStats,
  REJECTION_REASONS,
} from '@/@crema/types/models/coachApplication';

export class CertificateVerificationApiService {
  /**
   * Get coach applications with pagination and filters
   */
  static async getApplications(_params: GetApplicationsParams): Promise<GetApplicationsResponse> {
    void _params;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get application by ID
   */
  static async getApplicationById(_applicationId: string): Promise<CoachApplication | null> {
    void _applicationId;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Review application (approve, reject, request info)
   */
  static async reviewApplication(_request: ReviewApplicationRequest): Promise<ApiResponse> {
    void _request;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Review individual certificate
   */
  static async reviewCertificate(_request: CertificateReviewRequest): Promise<ApiResponse> {
    void _request;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get filter options
   */
  static async getFilterOptions(): Promise<FilterOptions> {
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get rejection reasons
   */
  static async getRejectionReasons(): Promise<string[]> {
    return [...REJECTION_REASONS];
  }

  /**
   * Calculate application statistics
   */
  private static calculateStats(_applications: CoachApplication[]): ApplicationStats {
    void _applications;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Update application priority
   */
  static async updateApplicationPriority(
    _applicationId: string,
    _priority: CoachApplication['priority'],
    _adminId: string,
  ): Promise<ApiResponse> {
    void _applicationId;
    void _priority;
    void _adminId;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Add note to application
   */
  static async addApplicationNote(
    _applicationId: string,
    _note: string,
    _adminId: string,
  ): Promise<ApiResponse> {
    void _applicationId;
    void _note;
    void _adminId;
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
