// Dashboard Overview Types

export interface DashboardStats {
  users: UserStats;
  coaches: CoachStats;
  sessions: SessionStats;
  revenue: RevenueStats;
  content: ContentStats;
  system: SystemStats;
}

export interface UserStats {
  total: number;
  active: number;
  newThisMonth: number;
  growthRate: number; // percentage
  activeRate: number; // percentage
  topCountries: CountryStats[];
  ageDistribution: AgeDistribution[];
  registrationTrend: TrendData[];
}

export interface CoachStats {
  total: number;
  verified: number;
  pending: number;
  suspended: number;
  averageRating: number;
  totalSessions: number;
  topPerformers: TopCoach[];
  verificationTrend: TrendData[];
  performanceMetrics: PerformanceMetric[];
}

export interface SessionStats {
  totalThisMonth: number;
  completedThisMonth: number;
  cancelledThisMonth: number;
  completionRate: number; // percentage
  averageDuration: number; // minutes
  totalHours: number;
  sessionsByType: SessionTypeStats[];
  dailyTrend: TrendData[];
  hourlyDistribution: HourlyStats[];
}

export interface RevenueStats {
  totalThisMonth: number;
  totalLastMonth: number;
  growthRate: number; // percentage
  averagePerSession: number;
  totalRevenue: number;
  revenueBySource: RevenueSource[];
  monthlyTrend: TrendData[];
  topPayingUsers: TopUser[];
}

export interface ContentStats {
  totalChapters: number;
  totalLessons: number;
  totalQuizzes: number;
  averageCompletionRate: number;
  mostPopularContent: PopularContent[];
  contentEngagement: EngagementStats[];
}

export interface SystemStats {
  pendingApprovals: number;
  activeReports: number;
  systemHealth: number; // percentage
  uptime: number; // percentage
  responseTime: number; // ms
  errorRate: number; // percentage
}

// Supporting Types
export interface CountryStats {
  country: string;
  countryCode: string;
  count: number;
  percentage: number;
}

export interface AgeDistribution {
  ageGroup: string;
  count: number;
  percentage: number;
}

export interface TrendData {
  date: string;
  value: number;
  label?: string;
}

export interface TopCoach {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  sessionsCount: number;
  revenue: number;
  specialization: string;
}

export interface PerformanceMetric {
  metric: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface SessionTypeStats {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

export interface HourlyStats {
  hour: number;
  count: number;
  label: string;
}

export interface RevenueSource {
  source: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface TopUser {
  id: string;
  name: string;
  avatar?: string;
  totalSpent: number;
  sessionsCount: number;
  joinDate: string;
}

export interface PopularContent {
  id: string;
  title: string;
  type: 'chapter' | 'lesson' | 'quiz';
  views: number;
  completionRate: number;
  rating: number;
}

export interface EngagementStats {
  contentId: string;
  contentTitle: string;
  views: number;
  timeSpent: number; // minutes
  completions: number;
  rating: number;
}

// Activity Feed Types
export interface ActivityFeedItem {
  id: string;
  type:
    | 'user_registration'
    | 'session_completed'
    | 'payment_received'
    | 'coach_verified'
    | 'report_submitted'
    | 'course_approved';
  title: string;
  description: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata?: any;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  status?: 'pending' | 'completed' | 'failed';
}

export interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  timestamp: string;
  dismissed: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Quick Actions
export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  url: string;
  count?: number;
  enabled: boolean;
}

// Pending Items
export interface PendingApproval {
  id: string;
  type: 'coach_verification' | 'course_approval' | 'certificate_review';
  title: string;
  description: string;
  submittedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  submittedAt: string;
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number; // minutes
  actionUrl: string;
}

export interface RecentReport {
  id: string;
  type: 'user_report' | 'coach_report' | 'session_issue' | 'payment_dispute';
  title: string;
  description: string;
  reportedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  reportedAt: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'investigating' | 'resolved' | 'dismissed';
  actionUrl: string;
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
  category?: string;
  color?: string;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color: string;
  type?: 'line' | 'bar' | 'area' | 'pie';
}

export interface ChartConfig {
  title: string;
  subtitle?: string;
  type: 'line' | 'bar' | 'area' | 'pie' | 'donut' | 'gauge';
  series: ChartSeries[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  responsive?: boolean;
  animation?: boolean;
}

// API Response Types
export interface GetDashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
  lastUpdated: string;
}

export interface GetActivityFeedResponse {
  success: boolean;
  data: {
    activities: ActivityFeedItem[];
    alerts: SystemAlert[];
    total: number;
  };
}

export interface GetQuickActionsResponse {
  success: boolean;
  data: QuickAction[];
}

export interface GetPendingItemsResponse {
  success: boolean;
  data: {
    approvals: PendingApproval[];
    reports: RecentReport[];
    totalPending: number;
  };
}

// Filter and Params
export interface DashboardFilters {
  dateRange: [string, string];
  userType?: 'all' | 'learner' | 'coach';
  sessionType?: 'all' | 'online' | 'offline';
  region?: string;
}

export interface GetDashboardParams {
  filters?: DashboardFilters;
  includeCharts?: boolean;
  includeActivities?: boolean;
  refreshCache?: boolean;
}

// Utility Types
export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';
export type MetricTrend = 'up' | 'down' | 'stable';
export type ChartTheme = 'light' | 'dark' | 'auto';

export interface DashboardPreferences {
  theme: ChartTheme;
  defaultTimeRange: TimeRange;
  refreshInterval: number; // seconds
  enableNotifications: boolean;
  compactMode: boolean;
}

// Export main types
export type {
  DashboardStats as default,
  ActivityFeedItem,
  SystemAlert,
  QuickAction,
  PendingApproval,
  RecentReport,
  ChartConfig,
};
