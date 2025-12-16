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
}
