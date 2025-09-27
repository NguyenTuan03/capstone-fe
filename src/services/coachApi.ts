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
import coachData from '@/data/coaches.json';

// Simulate API delay
const simulateDelay = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms));

export class CoachApiService {
  /**
   * Get coaches with pagination and filters
   */
  static async getCoaches(params: GetCoachesParams): Promise<GetCoachesResponse> {
    await simulateDelay();

    let filteredCoaches = [...coachData.coaches] as Coach[];

    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredCoaches = filteredCoaches.filter(
        (coach) =>
          coach.name.toLowerCase().includes(searchTerm) ||
          coach.email.toLowerCase().includes(searchTerm) ||
          coach.specialties.some((s) => s.toLowerCase().includes(searchTerm)),
      );
    }

    // Apply status filter
    if (params.status && params.status !== 'all') {
      filteredCoaches = filteredCoaches.filter((coach) => coach.status === params.status);
    }

    // Apply specialty filter
    if (params.specialty && params.specialty !== 'all') {
      filteredCoaches = filteredCoaches.filter((coach) =>
        coach.specialties.includes(params.specialty!),
      );
    }

    // Apply rating filter
    if (params.minRating) {
      filteredCoaches = filteredCoaches.filter((coach) => coach.rating >= params.minRating!);
    }

    // Calculate pagination
    const total = filteredCoaches.length;
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedCoaches = filteredCoaches.slice(startIndex, endIndex);

    return {
      coaches: paginatedCoaches,
      total,
      page: params.page,
      limit: params.limit,
    };
  }

  /**
   * Get coach by ID
   */
  static async getCoachById(coachId: string): Promise<Coach | null> {
    await simulateDelay();

    const coach = coachData.coaches.find((c) => c.id === coachId);
    return (coach as Coach) || null;
  }

  /**
   * Get coach statistics
   */
  static async getCoachStats(): Promise<CoachStats> {
    await simulateDelay();

    const coaches = coachData.coaches as Coach[];
    const activeCoaches = coaches.filter((c) => c.status === 'active');

    return {
      total: coaches.length,
      active: activeCoaches.length,
      suspended: coaches.filter((c) => c.status === 'suspended').length,
      pending: coaches.filter((c) => c.status === 'pending').length,
      avgRating:
        activeCoaches.length > 0
          ? activeCoaches.reduce((sum, c) => sum + c.rating, 0) / activeCoaches.length
          : 0,
      totalSessions: coaches.reduce((sum, c) => sum + c.totalSessions, 0),
    };
  }

  /**
   * Get coach qualities for quality management
   */
  static async getCoachQualities(): Promise<CoachQuality[]> {
    await simulateDelay();

    return coachData.coachQualities as CoachQuality[];
  }

  /**
   * Get reviews for a specific coach
   */
  static async getCoachReviews(coachId: string): Promise<CoachReview[]> {
    await simulateDelay();

    const reviews = coachData.coachReviews.filter((r) => r.coachId === coachId) as CoachReview[];
    return reviews.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  /**
   * Get all reviews with coach info
   */
  static async getAllReviews(): Promise<(CoachReview & { coachName: string })[]> {
    await simulateDelay();

    const reviews = coachData.coachReviews as CoachReview[];
    const coaches = coachData.coaches as Coach[];

    return reviews
      .map((review) => ({
        ...review,
        coachName: coaches.find((c) => c.id === review.coachId)?.name || 'Unknown Coach',
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Suspend coach
   */
  static async suspendCoach(request: SuspendCoachRequest): Promise<ApiResponse> {
    await simulateDelay();

    try {
      console.log('Suspending coach:', request);

      return {
        success: true,
        message: 'Đã đình chỉ huấn luyện viên thành công',
        data: {
          coachId: request.coachId,
          suspendedAt: new Date().toISOString(),
          reason: request.reason,
          evidence: request.evidence,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể đình chỉ huấn luyện viên',
      };
    }
  }

  /**
   * Restore suspended coach
   */
  static async restoreCoach(
    coachId: string,
    adminId: string,
    notes?: string,
  ): Promise<ApiResponse> {
    await simulateDelay();

    try {
      console.log('Restoring coach:', { coachId, adminId, notes });

      return {
        success: true,
        message: 'Đã khôi phục huấn luyện viên thành công',
        data: {
          coachId,
          restoredAt: new Date().toISOString(),
          notes,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể khôi phục huấn luyện viên',
      };
    }
  }

  /**
   * Get suspend reason suggestions
   */
  static async getSuspendReasons(): Promise<string[]> {
    await simulateDelay(200);

    return coachData.suspendReasons;
  }

  /**
   * Update certificate status
   */
  static async updateCertificateStatus(
    coachId: string,
    certId: string,
    status: 'verified' | 'rejected',
    adminId: string,
    notes?: string,
  ): Promise<ApiResponse> {
    await simulateDelay();

    try {
      console.log('Updating certificate:', { coachId, certId, status, adminId, notes });

      return {
        success: true,
        message:
          status === 'verified' ? 'Đã xác minh chứng chỉ thành công' : 'Đã từ chối chứng chỉ',
        data: {
          coachId,
          certId,
          status,
          verifiedBy: adminId,
          verifiedAt: new Date().toISOString(),
          notes,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể cập nhật trạng thái chứng chỉ',
      };
    }
  }
}
