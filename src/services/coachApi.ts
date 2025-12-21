import {
  Coach,
  CoachStats,
  GetCoachesParams,
  GetCoachesResponse,
  CoachReview,
  CoachQuality,
  SuspendCoachRequest,
  ApiResponse,
} from '@/types/coach';

export class CoachApiService {
  /**
   * Get coaches with pagination and filters
   */
  static async getCoaches(_params: GetCoachesParams): Promise<GetCoachesResponse> {
    void _params;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get coach by ID
   */
  static async getCoachById(_coachId: string): Promise<Coach | null> {
    void _coachId;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get coach statistics
   */
  static async getCoachStats(): Promise<CoachStats> {
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get coach qualities for quality management
   */
  static async getCoachQualities(): Promise<CoachQuality[]> {
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get reviews for a specific coach
   */
  static async getCoachReviews(_coachId: string): Promise<CoachReview[]> {
    void _coachId;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get all reviews with coach info
   */
  static async getAllReviews(): Promise<(CoachReview & { coachName: string })[]> {
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Suspend coach
   */
  static async suspendCoach(_request: SuspendCoachRequest): Promise<ApiResponse> {
    void _request;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Restore suspended coach
   */
  static async restoreCoach(
    _coachId: string,
    _adminId: string,
    _notes?: string,
  ): Promise<ApiResponse> {
    void _coachId;
    void _adminId;
    void _notes;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get suspend reason suggestions
   */
  static async getSuspendReasons(): Promise<string[]> {
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Approve coach application
   */
  static async approveApplication(
    _applicationId: string,
  ): Promise<{ success: boolean; message: string }> {
    void _applicationId;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Reject coach application
   */
  static async rejectApplication(
    _applicationId: string,
    _data: { reason: string; notes?: string; adminId: string },
  ): Promise<{ success: boolean; message: string }> {
    void _applicationId;
    void _data;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Request supplement information
   */
  static async requestSupplement(
    _applicationId: string,
    _data: { requirements: string; notes?: string; adminId: string },
  ): Promise<{ success: boolean; message: string }> {
    void _applicationId;
    void _data;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Update certificate status
   */
  static async updateCertificateStatus(
    _coachId: string,
    _certId: string,
    _status: 'verified' | 'rejected',
    _adminId: string,
    _notes?: string,
  ): Promise<ApiResponse> {
    void _coachId;
    void _certId;
    void _status;
    void _adminId;
    void _notes;
    throw new Error('Method not implemented. Please implement real API call.');
  }
}
