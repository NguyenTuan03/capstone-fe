import { 
  GetSessionsParams, 
  GetSessionsResponse, 
  SessionDetail, 
  SessionApiResponse, 
  SessionListStats,
  GetReportsParams,
  GetReportsResponse,
  SessionReport,
  ReportApiResponse,
  ReportStats,
  SessionAction,
  SessionActionResponse,
  SessionFilters,
  ReportFilters
} from '@/types/session';
import sessionsData from '@/data/sessions.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class SessionApiService {
  private static sessions: SessionDetail[] = sessionsData.sessions as SessionDetail[];
  private static reports: SessionReport[] = sessionsData.reports as SessionReport[];

  // Get all sessions with pagination and filters
  static async getSessions(params: GetSessionsParams = {}): Promise<GetSessionsResponse> {
    await delay(800);

    const {
      page = 1,
      limit = 10,
      search = '',
      status = 'all',
      paymentStatus = 'all',
      type = 'all',
      coachId = '',
      learnerId = '',
      dateFrom = '',
      dateTo = '',
      sortBy = 'date',
      sortOrder = 'desc'
    } = params;

    let filteredSessions = [...this.sessions];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredSessions = filteredSessions.filter(session =>
        session.learnerName.toLowerCase().includes(searchLower) ||
        session.coachName.toLowerCase().includes(searchLower) ||
        session.id.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (status !== 'all') {
      filteredSessions = filteredSessions.filter(session => session.status === status);
    }

    // Apply payment status filter
    if (paymentStatus !== 'all') {
      filteredSessions = filteredSessions.filter(session => session.paymentStatus === paymentStatus);
    }

    // Apply type filter
    if (type !== 'all') {
      filteredSessions = filteredSessions.filter(session => session.type === type);
    }

    // Apply coach filter
    if (coachId) {
      filteredSessions = filteredSessions.filter(session => session.coachId === coachId);
    }

    // Apply learner filter
    if (learnerId) {
      filteredSessions = filteredSessions.filter(session => session.learnerId === learnerId);
    }

    // Apply date range filter
    if (dateFrom) {
      filteredSessions = filteredSessions.filter(session => session.date >= dateFrom);
    }
    if (dateTo) {
      filteredSessions = filteredSessions.filter(session => session.date <= dateTo);
    }

    // Apply sorting
    filteredSessions.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date + ' ' + a.time);
          bValue = new Date(b.date + ' ' + b.time);
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSessions = filteredSessions.slice(startIndex, endIndex);

    return {
      sessions: paginatedSessions,
      total: filteredSessions.length,
      page,
      limit,
      totalPages: Math.ceil(filteredSessions.length / limit)
    };
  }

  // Get session by ID
  static async getSessionById(id: string): Promise<SessionDetail | null> {
    await delay(500);
    
    const session = this.sessions.find(s => s.id === id);
    return session || null;
  }

  // Get all sessions data (for admin overview)
  static async getAllSessionsData(): Promise<SessionApiResponse> {
    await delay(600);
    
    const stats = await this.getSessionStats();
    const filters = await this.getSessionFilters();
    
    return {
      sessions: this.sessions,
      stats,
      filters
    };
  }

  // Get session statistics
  static async getSessionStats(): Promise<SessionListStats> {
    await delay(400);
    
    const stats: SessionListStats = {
      total: this.sessions.length,
      upcoming: this.sessions.filter(s => s.status === 'upcoming').length,
      completed: this.sessions.filter(s => s.status === 'completed').length,
      cancelled: this.sessions.filter(s => s.status === 'cancelled').length,
      inProgress: this.sessions.filter(s => s.status === 'in_progress').length,
      noShow: this.sessions.filter(s => s.status === 'no_show').length,
      totalRevenue: this.sessions
        .filter(s => s.paymentStatus === 'paid')
        .reduce((sum, s) => sum + s.amount, 0),
      pendingPayments: this.sessions.filter(s => s.paymentStatus === 'pending').length,
      refundedAmount: this.sessions
        .filter(s => s.paymentStatus === 'refunded')
        .reduce((sum, s) => sum + (s.refundAmount || s.amount), 0)
    };
    
    return stats;
  }

  // Get session filters
  static async getSessionFilters(): Promise<SessionFilters> {
    await delay(300);
    
    // Get unique coaches and learners
    const coaches = [...new Set(this.sessions.map(s => ({ id: s.coachId, name: s.coachName })))];
    const learners = [...new Set(this.sessions.map(s => ({ id: s.learnerId, name: s.learnerName })))];
    
    return {
      status: [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'upcoming', label: 'Sắp diễn ra' },
        { value: 'in_progress', label: 'Đang diễn ra' },
        { value: 'completed', label: 'Đã hoàn thành' },
        { value: 'cancelled', label: 'Đã hủy' },
        { value: 'no_show', label: 'Không tham gia' }
      ],
      paymentStatus: [
        { value: 'all', label: 'Tất cả thanh toán' },
        { value: 'paid', label: 'Đã thanh toán' },
        { value: 'pending', label: 'Chờ thanh toán' },
        { value: 'refunded', label: 'Đã hoàn tiền' },
        { value: 'failed', label: 'Thanh toán lỗi' }
      ],
      type: [
        { value: 'all', label: 'Tất cả hình thức' },
        { value: 'online', label: 'Online' },
        { value: 'offline', label: 'Offline' }
      ],
      coaches: [
        { value: '', label: 'Tất cả coach' },
        ...coaches.map(c => ({ value: c.id, label: c.name }))
      ],
      learners: [
        { value: '', label: 'Tất cả học viên' },
        ...learners.map(l => ({ value: l.id, label: l.name }))
      ],
      dateRange: [
        { value: 'all', label: 'Tất cả thời gian' },
        { value: 'today', label: 'Hôm nay' },
        { value: 'week', label: 'Tuần này' },
        { value: 'month', label: 'Tháng này' },
        { value: 'custom', label: 'Tùy chọn' }
      ]
    };
  }

  // Session Actions
  static async cancelSession(sessionId: string, reason: string): Promise<SessionActionResponse> {
    await delay(1000);
    
    const sessionIndex = this.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      return { success: false, message: 'Không tìm thấy buổi học' };
    }

    this.sessions[sessionIndex] = {
      ...this.sessions[sessionIndex],
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      cancelledBy: 'admin_001', // Should be current admin ID
      cancelReason: reason,
      updatedAt: new Date().toISOString()
    };

    return { 
      success: true, 
      message: 'Đã hủy buổi học thành công',
      data: this.sessions[sessionIndex]
    };
  }

  static async refundSession(sessionId: string, refundAmount?: number): Promise<SessionActionResponse> {
    await delay(1200);
    
    const sessionIndex = this.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      return { success: false, message: 'Không tìm thấy buổi học' };
    }

    const session = this.sessions[sessionIndex];
    const finalRefundAmount = refundAmount || session.amount;

    this.sessions[sessionIndex] = {
      ...session,
      paymentStatus: 'refunded',
      refundedAt: new Date().toISOString(),
      refundAmount: finalRefundAmount,
      updatedAt: new Date().toISOString()
    };

    return { 
      success: true, 
      message: `Đã hoàn tiền ${finalRefundAmount.toLocaleString('vi-VN')} VND`,
      data: this.sessions[sessionIndex]
    };
  }

  static async warnUser(userId: string, reason: string, userType: 'learner' | 'coach'): Promise<SessionActionResponse> {
    await delay(800);
    
    // In a real app, this would create a warning record in the user's profile
    return { 
      success: true, 
      message: `Đã gửi cảnh cáo đến ${userType === 'learner' ? 'học viên' : 'coach'}`,
      data: { userId, reason, userType, warnedAt: new Date().toISOString() }
    };
  }

  // Reports Management
  static async getReports(params: GetReportsParams = {}): Promise<GetReportsResponse> {
    await delay(700);

    const {
      page = 1,
      limit = 10,
      search = '',
      status = 'all',
      priority = 'all',
      reason = 'all',
      reporterType = 'all',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params;

    let filteredReports = [...this.reports];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredReports = filteredReports.filter(report =>
        report.reporterName.toLowerCase().includes(searchLower) ||
        report.reportedName.toLowerCase().includes(searchLower) ||
        report.description.toLowerCase().includes(searchLower) ||
        report.id.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (status !== 'all') {
      filteredReports = filteredReports.filter(report => report.status === status);
    }

    // Apply priority filter
    if (priority !== 'all') {
      filteredReports = filteredReports.filter(report => report.priority === priority);
    }

    // Apply reason filter
    if (reason !== 'all') {
      filteredReports = filteredReports.filter(report => report.reason === reason);
    }

    // Apply reporter type filter
    if (reporterType !== 'all') {
      filteredReports = filteredReports.filter(report => report.reporterType === reporterType);
    }

    // Apply sorting
    filteredReports.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'priority':
          const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReports = filteredReports.slice(startIndex, endIndex);

    return {
      reports: paginatedReports,
      total: filteredReports.length,
      page,
      limit,
      totalPages: Math.ceil(filteredReports.length / limit)
    };
  }

  // Get report by ID
  static async getReportById(id: string): Promise<SessionReport | null> {
    await delay(400);
    
    const report = this.reports.find(r => r.id === id);
    return report || null;
  }

  // Get all reports data
  static async getAllReportsData(): Promise<ReportApiResponse> {
    await delay(500);
    
    const stats = await this.getReportStats();
    const filters = await this.getReportFilters();
    
    return {
      reports: this.reports,
      stats,
      filters
    };
  }

  // Get report statistics
  static async getReportStats(): Promise<ReportStats> {
    await delay(300);
    
    const resolvedReports = this.reports.filter(r => r.status === 'resolved' && r.resolvedAt);
    const avgResolutionTime = resolvedReports.length > 0 
      ? resolvedReports.reduce((sum, r) => {
          const created = new Date(r.createdAt);
          const resolved = new Date(r.resolvedAt!);
          return sum + (resolved.getTime() - created.getTime()) / (1000 * 60 * 60); // hours
        }, 0) / resolvedReports.length
      : 0;
    
    const stats: ReportStats = {
      total: this.reports.length,
      pending: this.reports.filter(r => r.status === 'pending').length,
      investigating: this.reports.filter(r => r.status === 'investigating').length,
      resolved: this.reports.filter(r => r.status === 'resolved').length,
      dismissed: this.reports.filter(r => r.status === 'dismissed').length,
      highPriority: this.reports.filter(r => r.priority === 'high' || r.priority === 'urgent').length,
      avgResolutionTime: Math.round(avgResolutionTime * 10) / 10
    };
    
    return stats;
  }

  // Get report filters
  static async getReportFilters(): Promise<ReportFilters> {
    await delay(200);
    
    return {
      status: [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'pending', label: 'Chờ xử lý' },
        { value: 'investigating', label: 'Đang điều tra' },
        { value: 'resolved', label: 'Đã giải quyết' },
        { value: 'dismissed', label: 'Đã bác bỏ' }
      ],
      priority: [
        { value: 'all', label: 'Tất cả mức độ' },
        { value: 'urgent', label: 'Khẩn cấp' },
        { value: 'high', label: 'Cao' },
        { value: 'medium', label: 'Trung bình' },
        { value: 'low', label: 'Thấp' }
      ],
      reason: [
        { value: 'all', label: 'Tất cả lý do' },
        { value: 'no_show', label: 'Không tham gia' },
        { value: 'inappropriate_behavior', label: 'Hành vi không phù hợp' },
        { value: 'technical_issues', label: 'Vấn đề kỹ thuật' },
        { value: 'quality_issues', label: 'Vấn đề chất lượng' },
        { value: 'payment_dispute', label: 'Tranh chấp thanh toán' },
        { value: 'other', label: 'Khác' }
      ],
      reporterType: [
        { value: 'all', label: 'Tất cả người báo cáo' },
        { value: 'learner', label: 'Học viên' },
        { value: 'coach', label: 'Coach' }
      ]
    };
  }

  // Report Actions
  static async resolveReport(reportId: string, resolution: string, notes?: string): Promise<SessionActionResponse> {
    await delay(1000);
    
    const reportIndex = this.reports.findIndex(r => r.id === reportId);
    if (reportIndex === -1) {
      return { success: false, message: 'Không tìm thấy báo cáo' };
    }

    this.reports[reportIndex] = {
      ...this.reports[reportIndex],
      status: 'resolved',
      resolution,
      adminNotes: notes,
      resolvedBy: 'admin_001', // Should be current admin ID
      resolvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return { 
      success: true, 
      message: 'Đã giải quyết báo cáo thành công',
      data: this.reports[reportIndex]
    };
  }

  static async dismissReport(reportId: string, notes?: string): Promise<SessionActionResponse> {
    await delay(800);
    
    const reportIndex = this.reports.findIndex(r => r.id === reportId);
    if (reportIndex === -1) {
      return { success: false, message: 'Không tìm thấy báo cáo' };
    }

    this.reports[reportIndex] = {
      ...this.reports[reportIndex],
      status: 'dismissed',
      adminNotes: notes,
      resolvedBy: 'admin_001', // Should be current admin ID
      resolvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return { 
      success: true, 
      message: 'Đã bác bỏ báo cáo',
      data: this.reports[reportIndex]
    };
  }

  static async updateReportStatus(reportId: string, status: 'pending' | 'investigating' | 'resolved' | 'dismissed', notes?: string): Promise<SessionActionResponse> {
    await delay(600);
    
    const reportIndex = this.reports.findIndex(r => r.id === reportId);
    if (reportIndex === -1) {
      return { success: false, message: 'Không tìm thấy báo cáo' };
    }

    this.reports[reportIndex] = {
      ...this.reports[reportIndex],
      status,
      adminNotes: notes,
      updatedAt: new Date().toISOString()
    };

    return { 
      success: true, 
      message: `Đã cập nhật trạng thái báo cáo`,
      data: this.reports[reportIndex]
    };
  }
}
