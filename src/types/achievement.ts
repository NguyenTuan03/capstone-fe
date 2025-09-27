// Achievement Management Types

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  criteria: AchievementCriteria;
  rewards: AchievementRewards;
  status: 'active' | 'inactive' | 'archived';
  unlockedCount: number;
  totalUsers: number;
  unlockRate: number; // percentage
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type AchievementCategory =
  | 'learning' // Hoàn thành bài học, quiz
  | 'skill' // Thành thạo kỹ thuật
  | 'time' // Dựa trên thời gian học
  | 'social' // Tương tác xã hội
  | 'milestone' // Cột mốc quan trọng
  | 'special'; // Sự kiện đặc biệt

export type AchievementRarity =
  | 'common' // 70%+ users có thể đạt
  | 'rare' // 30-70% users có thể đạt
  | 'epic' // 10-30% users có thể đạt
  | 'legendary'; // <10% users có thể đạt

export interface AchievementCriteria {
  type: CriteriaType;
  target: number;
  condition?: string;
  timeframe?: number; // days
  additionalRules?: CriteriaRule[];
}

export type CriteriaType =
  | 'lesson_count' // Số bài học hoàn thành
  | 'quiz_score' // Điểm quiz đạt được
  | 'streak_days' // Số ngày liên tiếp
  | 'session_count' // Số session tham gia
  | 'chapter_complete' // Hoàn thành chương
  | 'perfect_score' // Đạt điểm tuyệt đối
  | 'time_spent' // Thời gian học tập
  | 'skill_level' // Trình độ kỹ năng
  | 'social_interaction' // Tương tác xã hội
  | 'custom'; // Điều kiện tùy chỉnh

export interface CriteriaRule {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'in_range';
  value: any;
  description: string;
}

export interface AchievementRewards {
  points: number;
  badge: string;
  title?: string;
  description: string;
  specialPerks?: string[];
}

// User Achievement Progress
export interface UserAchievementProgress {
  userId: string;
  userName: string;
  userAvatar?: string;
  achievementId: string;
  progress: number; // 0-100
  currentValue: number;
  targetValue: number;
  unlockedAt?: string;
  isUnlocked: boolean;
  lastUpdated: string;
}

// Achievement Statistics
export interface AchievementStats {
  totalAchievements: number;
  activeAchievements: number;
  totalUnlocks: number;
  averageUnlocksPerUser: number;
  mostPopularCategory: AchievementCategory;
  rarityDistribution: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  recentUnlocks: RecentUnlock[];
  topAchievements: TopAchievement[];
}

export interface RecentUnlock {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  achievementId: string;
  achievementName: string;
  achievementIcon: string;
  achievementRarity: AchievementRarity;
  unlockedAt: string;
}

export interface TopAchievement {
  id: string;
  name: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  unlockCount: number;
  unlockRate: number;
  trend: 'up' | 'down' | 'stable';
}

// API Request/Response Types
export interface GetAchievementsParams {
  page: number;
  limit: number;
  search?: string;
  category?: AchievementCategory | 'all';
  rarity?: AchievementRarity | 'all';
  status?: 'active' | 'inactive' | 'archived' | 'all';
  sortBy?: 'name' | 'unlockRate' | 'createdAt' | 'unlockedCount';
  sortOrder?: 'asc' | 'desc';
}

export interface GetAchievementsResponse {
  achievements: Achievement[];
  total: number;
  page: number;
  limit: number;
  stats: AchievementStats;
}

export interface CreateAchievementRequest {
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  criteria: AchievementCriteria;
  rewards: AchievementRewards;
  status?: 'active' | 'inactive';
}

export interface UpdateAchievementRequest {
  id: string;
  name?: string;
  description?: string;
  icon?: string;
  category?: AchievementCategory;
  rarity?: AchievementRarity;
  criteria?: AchievementCriteria;
  rewards?: AchievementRewards;
  status?: 'active' | 'inactive' | 'archived';
}

export interface GetUserProgressParams {
  achievementId?: string;
  userId?: string;
  status?: 'in_progress' | 'completed' | 'all';
  page: number;
  limit: number;
}

export interface GetUserProgressResponse {
  progress: UserAchievementProgress[];
  total: number;
  page: number;
  limit: number;
}

// Achievement Analytics
export interface AchievementAnalytics {
  overview: {
    totalAchievements: number;
    totalUnlocks: number;
    averageProgressRate: number;
    engagementScore: number;
  };
  categoryBreakdown: CategoryAnalytics[];
  rarityAnalytics: RarityAnalytics[];
  timeSeriesData: TimeSeriesPoint[];
  userEngagement: UserEngagementMetrics;
  topPerformers: TopPerformer[];
}

export interface CategoryAnalytics {
  category: AchievementCategory;
  count: number;
  totalUnlocks: number;
  averageUnlockRate: number;
  engagementScore: number;
  color: string;
}

export interface RarityAnalytics {
  rarity: AchievementRarity;
  count: number;
  averageUnlockRate: number;
  totalPoints: number;
  color: string;
}

export interface TimeSeriesPoint {
  date: string;
  unlocks: number;
  newAchievements: number;
  activeUsers: number;
}

export interface UserEngagementMetrics {
  totalActiveUsers: number;
  usersWithAchievements: number;
  averageAchievementsPerUser: number;
  retentionRate: number;
  motivationScore: number;
}

export interface TopPerformer {
  userId: string;
  userName: string;
  userAvatar?: string;
  totalAchievements: number;
  totalPoints: number;
  rareAchievements: number;
  lastAchievementDate: string;
  rank: number;
}

// Achievement Builder Types
export interface AchievementTemplate {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  criteria: AchievementCriteria;
  rewards: AchievementRewards;
  isPopular: boolean;
}

export interface CriteriaPreset {
  type: CriteriaType;
  name: string;
  description: string;
  defaultTarget: number;
  suggestedRarity: AchievementRarity;
  examples: string[];
}

// Badge and Icon Management
export interface BadgeAsset {
  id: string;
  name: string;
  url: string;
  category: string;
  rarity: AchievementRarity;
  isDefault: boolean;
  uploadedAt: string;
}

// Filter Options
export interface AchievementFilterOptions {
  categories: { value: string; label: string; color: string }[];
  rarities: { value: string; label: string; color: string }[];
  criteriaTypes: { value: string; label: string; description: string }[];
  statuses: { value: string; label: string }[];
}

// Activity Logs
export interface AchievementActivity {
  id: string;
  type: 'created' | 'updated' | 'unlocked' | 'archived';
  achievementId: string;
  achievementName: string;
  userId?: string;
  userName?: string;
  details: any;
  timestamp: string;
}

// Gamification Settings
export interface GamificationSettings {
  enableAchievements: boolean;
  enableBadges: boolean;
  enableLeaderboards: boolean;
  pointsSystem: {
    enabled: boolean;
    commonPoints: number;
    rarePoints: number;
    epicPoints: number;
    legendaryPoints: number;
  };
  notifications: {
    enableUnlockNotifications: boolean;
    enableProgressNotifications: boolean;
    enableReminderNotifications: boolean;
  };
  displaySettings: {
    showProgressBars: boolean;
    showRarityColors: boolean;
    showUnlockDates: boolean;
    animateUnlocks: boolean;
  };
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Export utility types
export type AchievementSortField = 'name' | 'unlockRate' | 'createdAt' | 'unlockedCount';
export type ProgressStatus = 'in_progress' | 'completed' | 'locked';
export type AnalyticsTimeRange = '7d' | '30d' | '90d' | '1y';

// Constants
export const ACHIEVEMENT_CATEGORIES = [
  { value: 'learning', label: 'Học tập', color: '#1890ff' },
  { value: 'skill', label: 'Kỹ năng', color: '#52c41a' },
  { value: 'time', label: 'Thời gian', color: '#faad14' },
  { value: 'social', label: 'Xã hội', color: '#722ed1' },
  { value: 'milestone', label: 'Cột mốc', color: '#eb2f96' },
  { value: 'special', label: 'Đặc biệt', color: '#13c2c2' },
] as const;

export const ACHIEVEMENT_RARITIES = [
  { value: 'common', label: 'Thường', color: '#8c8c8c' },
  { value: 'rare', label: 'Hiếm', color: '#1890ff' },
  { value: 'epic', label: 'Sử thi', color: '#722ed1' },
  { value: 'legendary', label: 'Huyền thoại', color: '#faad14' },
] as const;

export const CRITERIA_TYPES = [
  { value: 'lesson_count', label: 'Số bài học', description: 'Hoàn thành X bài học' },
  { value: 'quiz_score', label: 'Điểm quiz', description: 'Đạt điểm X trong quiz' },
  { value: 'streak_days', label: 'Chuỗi ngày', description: 'Học X ngày liên tiếp' },
  { value: 'session_count', label: 'Số session', description: 'Tham gia X sessions' },
  { value: 'chapter_complete', label: 'Hoàn thành chương', description: 'Hoàn thành X chương' },
  { value: 'perfect_score', label: 'Điểm tuyệt đối', description: 'Đạt 100% trong X quiz' },
  { value: 'time_spent', label: 'Thời gian học', description: 'Học tổng cộng X giờ' },
  { value: 'social_interaction', label: 'Tương tác xã hội', description: 'Tương tác X lần' },
] as const;
