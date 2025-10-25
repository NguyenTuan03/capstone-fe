import {
  DashboardStats,
  ActivityFeedItem,
  SystemAlert,
  QuickAction,
  PendingApproval,
  RecentReport,
  GetDashboardStatsResponse,
  GetActivityFeedResponse,
  GetQuickActionsResponse,
  GetPendingItemsResponse,
  GetDashboardParams,
} from '@/types/dashboard';
import { dashboardData } from '@/data/dashboard';

// Simulate API delay
const simulateDelay = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data
const stats = dashboardData.stats as DashboardStats;
const activities = dashboardData.activities as ActivityFeedItem[];
const alerts = dashboardData.alerts as SystemAlert[];
const quickActions = dashboardData.quickActions as QuickAction[];
const pendingApprovals = dashboardData.pendingApprovals as PendingApproval[];
const recentReports = dashboardData.recentReports as RecentReport[];

export class DashboardApiService {
  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(params?: GetDashboardParams): Promise<GetDashboardStatsResponse> {
    await simulateDelay();

    try {
      // In a real app, this would apply filters and fetch from API
      const filteredStats = { ...stats };

      // Apply date range filter if provided
      if (params?.filters?.dateRange) {
        // Mock: adjust stats based on date range
        const [startDate, endDate] = params.filters.dateRange;
        console.log('Filtering stats for date range:', startDate, 'to', endDate);

        // This is where you'd filter the actual data
        // For now, we'll just return the mock data
      }

      // Apply user type filter
      if (params?.filters?.userType && params.filters.userType !== 'all') {
        console.log('Filtering by user type:', params.filters.userType);
        // Adjust stats based on user type filter
      }

      return {
        success: true,
        data: filteredStats,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }

  /**
   * Get activity feed and system alerts
   */
  static async getActivityFeed(limit: number = 20): Promise<GetActivityFeedResponse> {
    await simulateDelay();

    try {
      // Sort activities by timestamp (most recent first)
      const sortedActivities = [...activities]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);

      // Filter active alerts (not dismissed)
      const activeAlerts = alerts.filter((alert) => !alert.dismissed);

      return {
        success: true,
        data: {
          activities: sortedActivities,
          alerts: activeAlerts,
          total: activities.length,
        },
      };
    } catch (error) {
      console.error('Error fetching activity feed:', error);
      throw new Error('Failed to fetch activity feed');
    }
  }

  /**
   * Get quick actions
   */
  static async getQuickActions(): Promise<GetQuickActionsResponse> {
    await simulateDelay();

    try {
      // Filter enabled actions only
      const enabledActions = quickActions.filter((action) => action.enabled);

      return {
        success: true,
        data: enabledActions,
      };
    } catch (error) {
      console.error('Error fetching quick actions:', error);
      throw new Error('Failed to fetch quick actions');
    }
  }

  /**
   * Get pending items (approvals and reports)
   */
  static async getPendingItems(): Promise<GetPendingItemsResponse> {
    await simulateDelay();

    try {
      // Sort by priority and date
      const sortedApprovals = [...pendingApprovals].sort((a, b) => {
        // Priority order: high > medium > low
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];

        if (priorityDiff !== 0) return priorityDiff;

        // If same priority, sort by submission date (oldest first)
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      });

      // Sort reports by severity and date
      const sortedReports = [...recentReports].sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];

        if (severityDiff !== 0) return severityDiff;

        return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
      });

      const totalPending =
        sortedApprovals.length + sortedReports.filter((r) => r.status === 'new').length;

      return {
        success: true,
        data: {
          approvals: sortedApprovals,
          reports: sortedReports,
          totalPending,
        },
      };
    } catch (error) {
      console.error('Error fetching pending items:', error);
      throw new Error('Failed to fetch pending items');
    }
  }

  /**
   * Dismiss system alert
   */
  static async dismissAlert(alertId: string): Promise<{ success: boolean; message: string }> {
    await simulateDelay();

    try {
      const alertIndex = alerts.findIndex((alert) => alert.id === alertId);
      if (alertIndex === -1) {
        return {
          success: false,
          message: 'Không tìm thấy thông báo',
        };
      }

      alerts[alertIndex].dismissed = true;

      return {
        success: true,
        message: 'Đã ẩn thông báo',
      };
    } catch (error) {
      console.error('Error dismissing alert:', error);
      return {
        success: false,
        message: 'Không thể ẩn thông báo',
      };
    }
  }

  /**
   * Get real-time stats (for auto-refresh)
   */
  static async getRealTimeStats(): Promise<{
    users: { active: number; total: number };
    sessions: { active: number; completed: number };
    revenue: { today: number; thisMonth: number };
    system: { health: number; alerts: number };
  }> {
    await simulateDelay(50); // Faster for real-time updates

    try {
      // Simulate some real-time changes
      const now = new Date();
      const randomVariation = () => Math.floor(Math.random() * 10) - 5; // -5 to +5

      return {
        users: {
          active: stats.users.active + randomVariation(),
          total: stats.users.total + Math.floor(Math.random() * 3), // 0-2 new users
        },
        sessions: {
          active: Math.floor(Math.random() * 150) + 50, // 50-200 active sessions
          completed: stats.sessions.completedThisMonth + Math.floor(Math.random() * 5),
        },
        revenue: {
          today: Math.floor(Math.random() * 50000000) + 100000000, // 100M - 150M VND
          thisMonth: stats.revenue.totalThisMonth + Math.floor(Math.random() * 10000000),
        },
        system: {
          health: Math.min(100, stats.system.systemHealth + (Math.random() - 0.5)),
          alerts: alerts.filter((a) => !a.dismissed).length,
        },
      };
    } catch (error) {
      console.error('Error fetching real-time stats:', error);
      throw new Error('Failed to fetch real-time statistics');
    }
  }

  /**
   * Get chart data for specific metric
   */
  static async getChartData(
    metric: 'users' | 'sessions' | 'revenue' | 'coaches',
    timeRange: '7d' | '30d' | '90d' | '1y' = '30d',
  ): Promise<any[]> {
    await simulateDelay();

    try {
      switch (metric) {
        case 'users':
          return stats.users.registrationTrend;
        case 'sessions':
          return stats.sessions.dailyTrend;
        case 'revenue':
          return stats.revenue.monthlyTrend;
        case 'coaches':
          return stats.coaches.verificationTrend;
        default:
          return [];
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw new Error('Failed to fetch chart data');
    }
  }

  /**
   * Format currency (Vietnamese Dong)
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Format number with abbreviation (K, M, B)
   */
  static formatNumber(num: number): string {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  /**
   * Format percentage
   */
  static formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
  }

  /**
   * Get time ago string
   */
  static getTimeAgo(timestamp: string): string {
    if (!timestamp) return 'Chưa có dữ liệu';

    const now = new Date();
    const time = new Date(timestamp);

    // Check if date is valid
    if (isNaN(time.getTime())) return 'Dữ liệu không hợp lệ';

    const diff = now.getTime() - time.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;

    return time.toLocaleDateString('vi-VN');
  }

  /**
   * Get trend indicator
   */
  static getTrendIndicator(
    current: number,
    previous: number,
  ): {
    trend: 'up' | 'down' | 'stable';
    change: number;
    percentage: number;
  } {
    if (previous === 0) {
      return { trend: 'stable', change: 0, percentage: 0 };
    }

    const change = current - previous;
    const percentage = (change / previous) * 100;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (Math.abs(percentage) > 1) {
      trend = percentage > 0 ? 'up' : 'down';
    }

    return {
      trend,
      change: Math.abs(change),
      percentage: Math.abs(percentage),
    };
  }
}

export default DashboardApiService;
