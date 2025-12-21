import {
  DashboardStats,
  GetDashboardStatsResponse,
  GetActivityFeedResponse,
  GetQuickActionsResponse,
  GetPendingItemsResponse,
  GetDashboardParams,
} from '@/types/dashboard';

export class DashboardApiService {
  static async getDashboardStats(_params?: GetDashboardParams): Promise<GetDashboardStatsResponse> {
    void _params;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  static async getActivityFeed(_limit: number = 20): Promise<GetActivityFeedResponse> {
    void _limit;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  static async getQuickActions(): Promise<GetQuickActionsResponse> {
    throw new Error('Method not implemented. Please implement real API call.');
  }

  static async getPendingItems(): Promise<GetPendingItemsResponse> {
    throw new Error('Method not implemented. Please implement real API call.');
  }

  static async dismissAlert(_alertId: string): Promise<{ success: boolean; message: string }> {
    void _alertId;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  static async getRealTimeStats(): Promise<{
    success: boolean;
    data: DashboardStats;
    timestamp: string;
  }> {
    throw new Error('Method not implemented. Please implement real API call.');
  }

  static async getChartData(
    _range: '7d' | '30d' | '90d' | '1y' | 'all',
  ): Promise<{ success: boolean; data: any }> {
    void _range;
    throw new Error('Method not implemented. Please implement real API call.');
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  static formatNumber(num: number): string {
    return new Intl.NumberFormat('vi-VN').format(num);
  }

  static formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
  }

  /**
   * Get time ago string (e.g., "2 giờ trước", "3 ngày trước")
   */
  static getTimeAgo(dateString: string | Date): string {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'vừa xong';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ngày trước`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} tháng trước`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} năm trước`;
  }

  /**
   * Get trend indicator comparing current value with previous value
   * @param current Current value
   * @param previous Previous value
   * @returns Object with trend ('up' | 'down' | 'stable') and percentage change
   */
  static getTrendIndicator(
    current: number,
    previous: number,
  ): { trend: 'up' | 'down' | 'stable'; percentage: number } {
    if (previous === 0) {
      // If previous is 0, any positive current value is considered "up"
      if (current > 0) {
        return { trend: 'up', percentage: 100 };
      }
      return { trend: 'stable', percentage: 0 };
    }

    const percentage = ((current - previous) / previous) * 100;
    const absPercentage = Math.abs(percentage);

    // Consider changes less than 0.1% as stable
    if (absPercentage < 0.1) {
      return { trend: 'stable', percentage: 0 };
    }

    if (percentage > 0) {
      return { trend: 'up', percentage: absPercentage };
    } else {
      return { trend: 'down', percentage: absPercentage };
    }
  }
}
