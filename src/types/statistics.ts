// Statistics & 3D Visualization Types

export interface StatisticsData {
  overview: OverviewStats;
  userAnalytics: UserAnalytics;
  sessionAnalytics: SessionAnalytics;
  revenueAnalytics: RevenueAnalytics;
  engagementAnalytics: EngagementAnalytics;
  geographicData: GeographicData;
  timeSeriesData: TimeSeriesData;
}

// Overview Stats
export interface OverviewStats {
  totalUsers: StatValue;
  activeSessions: StatValue;
  totalRevenue: StatValue;
  avgSatisfaction: StatValue;
  growthRate: StatValue;
  systemHealth: StatValue;
}

export interface StatValue {
  current: number;
  previous: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  trend: number[]; // For mini sparkline
  unit?: string;
  format?: 'number' | 'currency' | 'percentage';
}

// User Analytics
export interface UserAnalytics {
  userGrowth: UserGrowthData;
  userDistribution: any; // UserDistributionData;
  deviceUsage: DeviceUsageData;
  userEngagement: UserEngagementData;
}

export interface UserGrowthData {
  monthly: MonthlyUserData[];
  byType: UserTypeData[];
  predictions: PredictionData[];
}

export interface MonthlyUserData {
  month: string;
  learners: number;
  coaches: number;
  admins: number;
  total: number;
  date: string;
}

export interface UserTypeData {
  type: 'learner' | 'coach' | 'admin';
  count: number;
  percentage: number;
  color: string;
  growth: number;
}

export interface DeviceUsageData {
  devices: DeviceData[];
  browsers: BrowserData[];
  platforms: PlatformData[];
}

export interface DeviceData {
  type: 'mobile' | 'desktop' | 'tablet';
  count: number;
  percentage: number;
  color: string;
  sessions: number;
  avgDuration: number;
}

export interface BrowserData {
  name: string;
  count: number;
  percentage: number;
  version: string;
}

export interface PlatformData {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface UserEngagementData {
  dailyActive: number[];
  weeklyActive: number[];
  monthlyActive: number[];
  retentionRates: RetentionData[];
  engagementScore: number;
}

export interface RetentionData {
  period: string;
  rate: number;
  cohort: string;
}

// Session Analytics
export interface SessionAnalytics {
  sessionActivity: SessionActivityData;
  coachPerformance: CoachPerformanceData;
  sessionTypes: SessionTypeData;
  peakHours: PeakHoursData;
}

export interface SessionActivityData {
  heatmap: HeatmapData[][];
  totalSessions: number;
  avgDuration: number;
  completionRate: number;
  busyTimes: any[]; // BusyTimeData[];
}

export interface HeatmapData {
  day: number; // 0-6 (Mon-Sun)
  hour: number; // 0-23
  value: number;
  label: string;
  color: string;
}

export interface CoachPerformanceData {
  coaches: CoachStatsData[];
  topPerformers: TopCoachData[];
  averageMetrics: CoachMetrics;
}

export interface CoachStatsData {
  id: string;
  name: string;
  avatar?: string;
  sessionsCompleted: number;
  averageRating: number;
  totalRevenue: number;
  studentsCount: number;
  specialties: string[];
  position: [number, number, number]; // 3D coordinates
  color: string;
}

export interface TopCoachData {
  id: string;
  name: string;
  avatar?: string;
  metric: string;
  value: number;
  rank: number;
  badge: string;
}

export interface CoachMetrics {
  avgRating: number;
  avgSessions: number;
  avgRevenue: number;
  completionRate: number;
}

export interface SessionTypeData {
  types: SessionTypeStats[];
  distribution: TypeDistribution[];
}

export interface SessionTypeStats {
  type: 'beginner' | 'intermediate' | 'advanced' | 'group' | 'private';
  count: number;
  percentage: number;
  avgDuration: number;
  avgRating: number;
  revenue: number;
  color: string;
  level: number; // For 3D pyramid
}

export interface TypeDistribution {
  type: string;
  online: number;
  offline: number;
  total: number;
}

export interface PeakHoursData {
  hourly: HourlyData[];
  daily: DailyData[];
  seasonal: SeasonalData[];
}

export interface HourlyData {
  hour: number;
  sessions: number;
  utilization: number;
}

export interface DailyData {
  day: string;
  sessions: number;
  revenue: number;
  coaches: number;
}

export interface SeasonalData {
  season: string;
  sessions: number;
  growth: number;
  color: string;
}

// Revenue Analytics
export interface RevenueAnalytics {
  revenueStreams: RevenueStreamData;
  growthTrajectory: GrowthTrajectoryData;
  topEarners: TopEarnersData;
  forecasting: ForecastingData;
}

export interface RevenueStreamData {
  streams: RevenueStream[];
  monthly: MonthlyRevenueData[];
  breakdown: RevenueBreakdown;
}

export interface RevenueStream {
  type: 'subscriptions' | 'sessions' | 'courses' | 'premium' | 'other';
  amount: number;
  percentage: number;
  growth: number;
  color: string;
  trend: number[];
}

export interface MonthlyRevenueData {
  month: string;
  subscriptions: number;
  sessions: number;
  courses: number;
  premium: number;
  total: number;
  date: string;
}

export interface RevenueBreakdown {
  gross: number;
  net: number;
  fees: number;
  refunds: number;
  taxes: number;
}

export interface GrowthTrajectoryData {
  historical: TrajectoryPoint[];
  projected: TrajectoryPoint[];
  milestones: Milestone[];
}

export interface TrajectoryPoint {
  date: string;
  value: number;
  type: 'actual' | 'projected';
  confidence?: number;
}

export interface Milestone {
  date: string;
  value: number;
  label: string;
  achieved: boolean;
}

export interface TopEarnersData {
  coaches: TopEarnerCoach[];
  podium: PodiumData[];
  leaderboard: LeaderboardEntry[];
}

export interface TopEarnerCoach {
  id: string;
  name: string;
  avatar?: string;
  earnings: number;
  sessions: number;
  rank: number;
  position: [number, number, number]; // 3D podium position
  badge: string;
  color: string;
}

export interface PodiumData {
  rank: 1 | 2 | 3;
  coach: TopEarnerCoach;
  height: number; // 3D podium height
  material: string; // gold, silver, bronze
}

export interface LeaderboardEntry {
  rank: number;
  coach: TopEarnerCoach;
  metric: string;
  value: number;
  change: number;
}

export interface ForecastingData {
  nextMonth: number;
  nextQuarter: number;
  nextYear: number;
  confidence: number;
  scenarios: ScenarioData[];
}

export interface ScenarioData {
  name: string;
  probability: number;
  outcome: number;
  factors: string[];
}

// Engagement Analytics
export interface EngagementAnalytics {
  achievementProgress: AchievementProgressData;
  userJourney: UserJourneyData;
  contentEngagement: ContentEngagementData;
  socialInteraction: SocialInteractionData;
}

export interface AchievementProgressData {
  categories: AchievementCategoryData[];
  spiral: SpiralData[];
  completion: CompletionData;
}

export interface AchievementCategoryData {
  category: string;
  completionRate: number;
  userCount: number;
  angle: number; // For 3D spiral
  radius: number; // Distance from center
  color: string;
  achievements: AchievementSummary[];
}

export interface SpiralData {
  angle: number;
  radius: number;
  height: number;
  category: string;
  value: number;
  color: string;
}

export interface CompletionData {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  averageTime: number;
}

export interface AchievementSummary {
  id: string;
  name: string;
  unlockRate: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserJourneyData {
  flows: JourneyFlow[];
  stages: JourneyStage[];
  dropoffs: DropoffPoint[];
}

export interface JourneyFlow {
  from: string;
  to: string;
  userCount: number;
  percentage: number;
  avgTime: number;
  path: [number, number, number][]; // 3D tube path
  color: string;
}

export interface JourneyStage {
  stage: string;
  userCount: number;
  conversionRate: number;
  avgTimeSpent: number;
  position: [number, number, number];
}

export interface DropoffPoint {
  stage: string;
  dropoffRate: number;
  reasons: string[];
  impact: 'high' | 'medium' | 'low';
}

export interface ContentEngagementData {
  lessons: LessonEngagementData[];
  courses: CourseEngagementData[];
  videos: VideoEngagementData[];
}

export interface LessonEngagementData {
  id: string;
  title: string;
  views: number;
  completionRate: number;
  avgRating: number;
  timeSpent: number;
  difficulty: number;
}

export interface CourseEngagementData {
  id: string;
  title: string;
  enrollments: number;
  completionRate: number;
  avgProgress: number;
  revenue: number;
}

export interface VideoEngagementData {
  id: string;
  title: string;
  views: number;
  watchTime: number;
  retentionRate: number;
  interactions: number;
}

export interface SocialInteractionData {
  likes: number;
  comments: number;
  shares: number;
  follows: number;
  networkGraph: NetworkNode[];
}

export interface NetworkNode {
  id: string;
  type: 'user' | 'coach' | 'content';
  connections: string[];
  position: [number, number, number];
  size: number;
  color: string;
}

// Geographic Data
export interface GeographicData {
  countries: CountryData[];
  regions: RegionData[];
  cities: CityData[];
  globe: GlobePoint[];
}

export interface CountryData {
  code: string;
  name: string;
  userCount: number;
  revenue: number;
  growth: number;
  coordinates: [number, number]; // lat, lng
  color: string;
}

export interface RegionData {
  name: string;
  userCount: number;
  density: number;
  engagement: number;
}

export interface CityData {
  name: string;
  country: string;
  userCount: number;
  coordinates: [number, number, number]; // lat, lng, elevation
  size: number;
}

export interface GlobePoint {
  coordinates: [number, number, number]; // x, y, z on sphere
  value: number;
  label: string;
  color: string;
  size: number;
}

// Time Series Data
export interface TimeSeriesData {
  realTime: RealTimeData;
  historical: HistoricalData;
  predictions: PredictionData[];
}

export interface RealTimeData {
  activeUsers: number;
  activeSessions: number;
  serverLoad: number;
  responseTime: number;
  errorRate: number;
  timestamp: string;
}

export interface HistoricalData {
  daily: DailyStats[];
  weekly: WeeklyStats[];
  monthly: MonthlyStats[];
  yearly: YearlyStats[];
}

export interface DailyStats {
  date: string;
  users: number;
  sessions: number;
  revenue: number;
  engagement: number;
}

export interface WeeklyStats {
  week: string;
  users: number;
  sessions: number;
  revenue: number;
  growth: number;
}

export interface MonthlyStats {
  month: string;
  users: number;
  sessions: number;
  revenue: number;
  churn: number;
}

export interface YearlyStats {
  year: string;
  users: number;
  sessions: number;
  revenue: number;
  milestones: string[];
}

export interface PredictionData {
  date: string;
  metric: string;
  predicted: number;
  confidence: number;
  range: [number, number]; // min, max
}

// 3D Chart Configuration
export interface Chart3DConfig {
  type:
    | '3d-bar'
    | '3d-donut'
    | '3d-heatmap'
    | '3d-globe'
    | '3d-spiral'
    | '3d-flow'
    | '3d-scatter'
    | '3d-surface';
  title: string;
  description?: string;
  dimensions: ChartDimensions;
  colors: ColorPalette;
  animations: AnimationConfig;
  interactions: InteractionConfig;
  camera: CameraConfig;
  lighting: LightingConfig;
}

export interface ChartDimensions {
  width: number;
  height: number;
  depth: number;
  scale: number;
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface ColorPalette {
  primary: string[];
  secondary: string[];
  gradients: GradientConfig[];
  materials: MaterialConfig[];
}

export interface GradientConfig {
  name: string;
  colors: string[];
  direction: 'horizontal' | 'vertical' | 'radial' | 'conical';
}

export interface MaterialConfig {
  name: string;
  type: 'basic' | 'standard' | 'physical' | 'lambert' | 'phong';
  properties: {
    color?: string;
    metalness?: number;
    roughness?: number;
    opacity?: number;
    transparent?: boolean;
    emissive?: string;
  };
}

export interface AnimationConfig {
  enabled: boolean;
  duration: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce';
  delay: number;
  loop: boolean;
  autoStart: boolean;
}

export interface InteractionConfig {
  hover: boolean;
  click: boolean;
  drag: boolean;
  zoom: boolean;
  rotate: boolean;
  pan: boolean;
  tooltips: boolean;
  selection: boolean;
}

export interface CameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  near: number;
  far: number;
  controls: 'orbit' | 'trackball' | 'fly' | 'first-person';
}

export interface LightingConfig {
  ambient: LightConfig;
  directional: LightConfig[];
  point: LightConfig[];
  spot: LightConfig[];
}

export interface LightConfig {
  color: string;
  intensity: number;
  position?: [number, number, number];
  target?: [number, number, number];
  castShadow?: boolean;
}

// API Types
export interface GetStatisticsParams {
  dateRange?: [string, string];
  metrics?: string[];
  granularity?: 'hour' | 'day' | 'week' | 'month' | 'year';
  includeRealTime?: boolean;
  includePredictions?: boolean;
  includeGeographic?: boolean;
  filters?: StatisticsFilters;
}

export interface StatisticsFilters {
  userTypes?: ('learner' | 'coach' | 'admin')[];
  sessionTypes?: string[];
  countries?: string[];
  platforms?: string[];
  ageGroups?: string[];
  experience?: string[];
}

export interface GetStatisticsResponse {
  success: boolean;
  data: StatisticsData;
  lastUpdated: string;
  nextUpdate: string;
  cacheExpiry: number;
}

export interface StatisticsApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Utility Types
export type ChartType =
  | '3d-bar'
  | '3d-donut'
  | '3d-heatmap'
  | '3d-globe'
  | '3d-spiral'
  | '3d-flow'
  | '3d-scatter'
  | '3d-surface';
export type MetricType =
  | 'users'
  | 'sessions'
  | 'revenue'
  | 'engagement'
  | 'performance'
  | 'geographic';
export type TimeGranularity = 'hour' | 'day' | 'week' | 'month' | 'year';
export type TrendDirection = 'up' | 'down' | 'stable';
export type DataQuality = 'high' | 'medium' | 'low';

// Constants
export const CHART_COLORS = {
  primary: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'],
  gradient: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
  material: ['#FFD700', '#C0C0C0', '#CD7F32', '#E5E4E2', '#FF6B6B', '#4ECDC4'],
} as const;

export const ANIMATION_PRESETS = {
  smooth: { duration: 1000, easing: 'ease-out' as const },
  bounce: { duration: 1500, easing: 'bounce' as const },
  quick: { duration: 300, easing: 'ease-in-out' as const },
  slow: { duration: 2000, easing: 'linear' as const },
} as const;

export const CAMERA_PRESETS = {
  overview: { position: [10, 10, 10] as [number, number, number], fov: 75 },
  detail: { position: [5, 5, 5] as [number, number, number], fov: 50 },
  wide: { position: [20, 15, 20] as [number, number, number], fov: 90 },
} as const;
