import {
  Session,
  SessionStats,
  GetSessionsParams,
  GetSessionsResponse,
  SessionReport,
  AdminAction,
  RefundRequest,
  SuspendUserRequest,
  WarnUserRequest,
  ApiResponse,
} from '@/types/session';
import sessionsData from '@/data/sessions.json';
import sessionsExtended from '@/data/sessions-extended.json';

// Simulate API delay
const simulateDelay = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms));

// Combine all sessions data
const allSessions = [...sessionsData.sessions, ...sessionsExtended.sessions] as Session[];

export class SessionApiService {
  /**
   * Get sessions with pagination and filters
   */
  static async getSessions(params: GetSessionsParams): Promise<GetSessionsResponse> {
    await simulateDelay();

    let filteredSessions = [...allSessions];

    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredSessions = filteredSessions.filter(
        (session) =>
          session.learner.name.toLowerCase().includes(searchTerm) ||
          session.coach.name.toLowerCase().includes(searchTerm) ||
          session.subject.toLowerCase().includes(searchTerm) ||
          session.id.toLowerCase().includes(searchTerm),
      );
    }

    // Apply status filter
    if (params.status && params.status !== 'all') {
      filteredSessions = filteredSessions.filter((session) => session.status === params.status);
    }

    // Apply type filter
    if (params.type && params.type !== 'all') {
      filteredSessions = filteredSessions.filter((session) => session.type === params.type);
    }

    // Apply coach filter
    if (params.coachId) {
      filteredSessions = filteredSessions.filter((session) => session.coach.id === params.coachId);
    }

    // Apply learner filter
    if (params.learnerId) {
      filteredSessions = filteredSessions.filter(
        (session) => session.learner.id === params.learnerId,
      );
    }

    // Apply date range filter
    if (params.dateRange && params.dateRange.length === 2) {
      const [startDate, endDate] = params.dateRange;
      filteredSessions = filteredSessions.filter((session) => {
        const sessionDate = new Date(session.scheduledTime);
        return sessionDate >= new Date(startDate) && sessionDate <= new Date(endDate);
      });
    }

    // Apply issues filter
    if (params.hasIssues !== undefined) {
      filteredSessions = filteredSessions.filter(
        (session) => session.hasIssues === params.hasIssues,
      );
    }

    // Apply recording filter
    if (params.hasRecording !== undefined) {
      filteredSessions = filteredSessions.filter(
        (session) => session.hasRecording === params.hasRecording,
      );
    }

    // Sort by scheduled time (newest first)
    filteredSessions.sort(
      (a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime(),
    );

    // Calculate pagination
    const total = filteredSessions.length;
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedSessions = filteredSessions.slice(startIndex, endIndex);

    // Calculate stats
    const stats = this.calculateStats(allSessions);

    return {
      sessions: paginatedSessions,
      total,
      page: params.page,
      limit: params.limit,
      stats,
    };
  }

  /**
   * Get session by ID
   */
  static async getSessionById(sessionId: string): Promise<Session | null> {
    await simulateDelay();

    const session = allSessions.find((s) => s.id === sessionId);
    return session || null;
  }

  /**
   * Calculate session statistics
   */
  private static calculateStats(sessions: Session[]): SessionStats {
    const completed = sessions.filter((s) => s.status === 'completed').length;
    const cancelled = sessions.filter((s) => s.status === 'cancelled').length;
    const scheduled = sessions.filter((s) => s.status === 'scheduled').length;
    const inProgress = sessions.filter((s) => s.status === 'in_progress').length;
    const noShow = sessions.filter((s) => s.status === 'no_show').length;

    const totalRevenue = sessions
      .filter((s) => s.paymentStatus === 'paid')
      .reduce((sum, s) => sum + s.totalAmount, 0);

    const refundedAmount = sessions
      .filter((s) => s.paymentStatus === 'refunded' || s.paymentStatus === 'partial_refund')
      .reduce((sum, s) => sum + (s.refundAmount || 0), 0);

    const pendingPayments = sessions
      .filter((s) => s.paymentStatus === 'pending')
      .reduce((sum, s) => sum + s.totalAmount, 0);

    const allReports = sessions.flatMap((s) => s.reports);
    const totalReports = allReports.length;
    const pendingReports = allReports.filter(
      (r) => r.status === 'pending' || r.status === 'investigating',
    ).length;
    const resolvedReports = allReports.filter((r) => r.status === 'resolved').length;

    // Calculate average rating from both learner and coach feedback
    const allRatings = sessions.flatMap((s) =>
      [s.learnerFeedback?.rating, s.coachFeedback?.rating].filter((rating) => rating !== undefined),
    ) as number[];

    const avgRating =
      allRatings.length > 0
        ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
        : 0;

    return {
      total: sessions.length,
      completed,
      cancelled,
      scheduled,
      inProgress,
      noShow,
      totalRevenue,
      refundedAmount,
      pendingPayments,
      totalReports,
      pendingReports,
      resolvedReports,
      avgRating,
      totalRatings: allRatings.length,
    };
  }

  /**
   * Process refund request
   */
  static async processRefund(request: RefundRequest): Promise<ApiResponse> {
    await simulateDelay();

    try {
      console.log('Processing refund:', request);

      return {
        success: true,
        message: `Đã hoàn tiền ${this.formatCurrency(request.amount)} thành công`,
        data: {
          sessionId: request.sessionId,
          refundAmount: request.amount,
          refundReason: request.reason,
          processedAt: new Date().toISOString(),
          processedBy: request.adminId,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể xử lý hoàn tiền',
      };
    }
  }

  /**
   * Suspend user (coach or learner)
   */
  static async suspendUser(request: SuspendUserRequest): Promise<ApiResponse> {
    await simulateDelay();

    try {
      console.log('Suspending user:', request);

      const durationText = request.duration === 0 ? 'vĩnh viễn' : `${request.duration} ngày`;

      return {
        success: true,
        message: `Đã tạm khóa ${request.userType === 'coach' ? 'huấn luyện viên' : 'học viên'} ${durationText}`,
        data: {
          userId: request.userId,
          userType: request.userType,
          sessionId: request.sessionId,
          duration: request.duration,
          suspendedAt: new Date().toISOString(),
          suspendedBy: request.adminId,
          reason: request.reason,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể tạm khóa người dùng',
      };
    }
  }

  /**
   * Send warning to user
   */
  static async warnUser(request: WarnUserRequest): Promise<ApiResponse> {
    await simulateDelay();

    try {
      console.log('Warning user:', request);

      return {
        success: true,
        message: `Đã gửi cảnh cáo đến ${request.userType === 'coach' ? 'huấn luyện viên' : 'học viên'}`,
        data: {
          userId: request.userId,
          userType: request.userType,
          sessionId: request.sessionId,
          severity: request.severity,
          warnedAt: new Date().toISOString(),
          warnedBy: request.adminId,
          reason: request.reason,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể gửi cảnh cáo',
      };
    }
  }

  /**
   * Resolve report
   */
  static async resolveReport(
    reportId: string,
    resolution: string,
    adminId: string,
  ): Promise<ApiResponse> {
    await simulateDelay();

    try {
      console.log('Resolving report:', { reportId, resolution, adminId });

      return {
        success: true,
        message: 'Đã giải quyết báo cáo thành công',
        data: {
          reportId,
          resolution,
          resolvedAt: new Date().toISOString(),
          resolvedBy: adminId,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể giải quyết báo cáo',
      };
    }
  }

  /**
   * Get report reasons
   */
  static async getReportReasons(): Promise<string[]> {
    await simulateDelay(200);

    return sessionsData.reportReasons;
  }

  /**
   * Get refund reasons
   */
  static async getRefundReasons(): Promise<string[]> {
    await simulateDelay(200);

    return sessionsData.refundReasons;
  }

  /**
   * Format currency
   */
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }

  /**
   * Update session status
   */
  static async updateSessionStatus(
    sessionId: string,
    status: Session['status'],
    adminId: string,
    notes?: string,
  ): Promise<ApiResponse> {
    await simulateDelay();

    try {
      console.log('Updating session status:', { sessionId, status, adminId, notes });

      return {
        success: true,
        message: 'Đã cập nhật trạng thái buổi học thành công',
        data: {
          sessionId,
          status,
          updatedAt: new Date().toISOString(),
          updatedBy: adminId,
          notes,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể cập nhật trạng thái buổi học',
      };
    }
  }
}
