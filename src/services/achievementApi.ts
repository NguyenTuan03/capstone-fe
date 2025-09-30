import {
  Achievement,
  AchievementStats,
  UserAchievementProgress,
  RecentUnlock,
  TopAchievement,
  AchievementTemplate,
  BadgeAsset,
  AchievementActivity,
  AchievementFilterOptions,
  GetAchievementsParams,
  GetAchievementsResponse,
  CreateAchievementRequest,
  UpdateAchievementRequest,
  GetUserProgressParams,
  GetUserProgressResponse,
  AchievementAnalytics,
  ApiResponse,
  AchievementCategory,
  AchievementRarity,
} from '@/types/achievement';
import achievementData from '@/data/achievements.json';

// Simulate API delay
const simulateDelay = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data
const allAchievements = achievementData.achievements as Achievement[];
const userProgress = achievementData.userProgress as UserAchievementProgress[];
const recentUnlocks = achievementData.recentUnlocks as RecentUnlock[];
const templates = achievementData.templates as AchievementTemplate[];
const badgeAssets = achievementData.badgeAssets as BadgeAsset[];
const activities = achievementData.activities as AchievementActivity[];
const filterOptions = achievementData.filterOptions as AchievementFilterOptions;

// Generate unique ID
const generateId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export class AchievementApiService {
  /**
   * Get achievements with pagination and filters
   */
  static async getAchievements(params: GetAchievementsParams): Promise<GetAchievementsResponse> {
    await simulateDelay();

    let filteredAchievements = [...allAchievements];

    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredAchievements = filteredAchievements.filter(
        (achievement) =>
          achievement.name.toLowerCase().includes(searchTerm) ||
          achievement.description.toLowerCase().includes(searchTerm),
      );
    }

    // Apply category filter
    if (params.category && params.category !== 'all') {
      filteredAchievements = filteredAchievements.filter(
        (achievement) => achievement.category === params.category,
      );
    }

    // Apply rarity filter
    if (params.rarity && params.rarity !== 'all') {
      filteredAchievements = filteredAchievements.filter(
        (achievement) => achievement.rarity === params.rarity,
      );
    }

    // Apply status filter
    if (params.status && params.status !== 'all') {
      filteredAchievements = filteredAchievements.filter(
        (achievement) => achievement.status === params.status,
      );
    }

    // Apply sorting
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';

    filteredAchievements.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'unlockRate':
          aValue = a.unlockRate;
          bValue = b.unlockRate;
          break;
        case 'unlockedCount':
          aValue = a.unlockedCount;
          bValue = b.unlockedCount;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Calculate pagination
    const total = filteredAchievements.length;
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedAchievements = filteredAchievements.slice(startIndex, endIndex);

    // Calculate stats
    const stats = this.calculateStats();

    return {
      achievements: paginatedAchievements,
      total,
      page: params.page,
      limit: params.limit,
      stats,
    };
  }

  /**
   * Get achievement by ID
   */
  static async getAchievementById(id: string): Promise<Achievement | null> {
    await simulateDelay();
    return allAchievements.find((achievement) => achievement.id === id) || null;
  }

  /**
   * Create new achievement
   */
  static async createAchievement(
    request: CreateAchievementRequest,
  ): Promise<ApiResponse<Achievement>> {
    await simulateDelay();

    try {
      const newAchievement: Achievement = {
        id: generateId('achievement'),
        name: request.name,
        description: request.description,
        icon: request.icon,
        category: request.category,
        rarity: request.rarity,
        criteria: request.criteria,
        rewards: request.rewards,
        status: request.status || 'active',
        unlockedCount: 0,
        totalUsers: 15420, // Mock total users
        unlockRate: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin-001',
        updatedBy: 'admin-001',
      };

      allAchievements.push(newAchievement);

      return {
        success: true,
        message: 'Đã tạo achievement mới thành công',
        data: newAchievement,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể tạo achievement mới',
      };
    }
  }

  /**
   * Update achievement
   */
  static async updateAchievement(
    request: UpdateAchievementRequest,
  ): Promise<ApiResponse<Achievement>> {
    await simulateDelay();

    try {
      const achievementIndex = allAchievements.findIndex((a) => a.id === request.id);
      if (achievementIndex === -1) {
        return {
          success: false,
          message: 'Không tìm thấy achievement',
        };
      }

      const updatedAchievement = {
        ...allAchievements[achievementIndex],
        ...(request.name && { name: request.name }),
        ...(request.description && { description: request.description }),
        ...(request.icon && { icon: request.icon }),
        ...(request.category && { category: request.category }),
        ...(request.rarity && { rarity: request.rarity }),
        ...(request.criteria && { criteria: request.criteria }),
        ...(request.rewards && { rewards: request.rewards }),
        ...(request.status && { status: request.status }),
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin-001',
      };

      allAchievements[achievementIndex] = updatedAchievement;

      return {
        success: true,
        message: 'Đã cập nhật achievement thành công',
        data: updatedAchievement,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể cập nhật achievement',
      };
    }
  }

  /**
   * Delete achievement
   */
  static async deleteAchievement(id: string): Promise<ApiResponse> {
    await simulateDelay();

    try {
      const achievementIndex = allAchievements.findIndex((a) => a.id === id);
      if (achievementIndex === -1) {
        return {
          success: false,
          message: 'Không tìm thấy achievement',
        };
      }

      const achievement = allAchievements[achievementIndex];

      // Check if achievement has been unlocked by users
      if (achievement.unlockedCount > 0) {
        // Archive instead of delete
        allAchievements[achievementIndex].status = 'archived';
        return {
          success: true,
          message: 'Achievement đã được lưu trữ do có users đã unlock',
        };
      }

      allAchievements.splice(achievementIndex, 1);

      return {
        success: true,
        message: 'Đã xóa achievement thành công',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể xóa achievement',
      };
    }
  }

  /**
   * Get user progress for achievements
   */
  static async getUserProgress(params: GetUserProgressParams): Promise<GetUserProgressResponse> {
    await simulateDelay();

    let filteredProgress = [...userProgress];

    // Apply achievement filter
    if (params.achievementId) {
      filteredProgress = filteredProgress.filter((p) => p.achievementId === params.achievementId);
    }

    // Apply user filter
    if (params.userId) {
      filteredProgress = filteredProgress.filter((p) => p.userId === params.userId);
    }

    // Apply status filter
    if (params.status && params.status !== 'all') {
      if (params.status === 'completed') {
        filteredProgress = filteredProgress.filter((p) => p.isUnlocked);
      } else if (params.status === 'in_progress') {
        filteredProgress = filteredProgress.filter((p) => !p.isUnlocked && p.progress > 0);
      }
    }

    // Sort by progress (highest first)
    filteredProgress.sort((a, b) => b.progress - a.progress);

    // Calculate pagination
    const total = filteredProgress.length;
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedProgress = filteredProgress.slice(startIndex, endIndex);

    return {
      progress: paginatedProgress,
      total,
      page: params.page,
      limit: params.limit,
    };
  }

  /**
   * Get recent unlocks
   */
  static async getRecentUnlocks(limit: number = 10): Promise<RecentUnlock[]> {
    await simulateDelay(50);

    return recentUnlocks
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
      .slice(0, limit);
  }

  /**
   * Get achievement templates
   */
  static async getAchievementTemplates(): Promise<AchievementTemplate[]> {
    await simulateDelay(50);
    return templates;
  }

  /**
   * Get badge assets
   */
  static async getBadgeAssets(): Promise<BadgeAsset[]> {
    await simulateDelay(50);
    return badgeAssets;
  }

  /**
   * Get achievement activities
   */
  static async getAchievementActivities(limit: number = 20): Promise<AchievementActivity[]> {
    await simulateDelay(50);

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * Get filter options
   */
  static async getFilterOptions(): Promise<AchievementFilterOptions> {
    await simulateDelay(30);
    return filterOptions;
  }

  /**
   * Get achievement analytics
   */
  static async getAchievementAnalytics(): Promise<AchievementAnalytics> {
    await simulateDelay();

    const stats = this.calculateStats();

    return {
      overview: {
        totalAchievements: stats.totalAchievements,
        totalUnlocks: stats.totalUnlocks,
        averageProgressRate: 67.5,
        engagementScore: 8.4,
      },
      categoryBreakdown: [
        {
          category: 'learning',
          count: 3,
          totalUnlocks: 24790,
          averageUnlockRate: 53.6,
          engagementScore: 8.2,
          color: '#1890ff',
        },
        {
          category: 'skill',
          count: 2,
          totalUnlocks: 3070,
          averageUnlockRate: 10.0,
          engagementScore: 9.1,
          color: '#52c41a',
        },
        {
          category: 'time',
          count: 2,
          totalUnlocks: 2000,
          averageUnlockRate: 6.5,
          engagementScore: 8.8,
          color: '#faad14',
        },
        {
          category: 'social',
          count: 2,
          totalUnlocks: 5960,
          averageUnlockRate: 19.3,
          engagementScore: 7.9,
          color: '#722ed1',
        },
        {
          category: 'milestone',
          count: 1,
          totalUnlocks: 45,
          averageUnlockRate: 0.3,
          engagementScore: 9.8,
          color: '#eb2f96',
        },
      ],
      rarityAnalytics: [
        { rarity: 'common', count: 3, averageUnlockRate: 58.2, totalPoints: 850, color: '#8c8c8c' },
        { rarity: 'rare', count: 3, averageUnlockRate: 15.7, totalPoints: 1850, color: '#1890ff' },
        { rarity: 'epic', count: 3, averageUnlockRate: 3.4, totalPoints: 3700, color: '#722ed1' },
        {
          rarity: 'legendary',
          count: 1,
          averageUnlockRate: 0.3,
          totalPoints: 5000,
          color: '#faad14',
        },
      ],
      timeSeriesData: [
        { date: '2024-02-01', unlocks: 120, newAchievements: 1, activeUsers: 850 },
        { date: '2024-02-08', unlocks: 145, newAchievements: 0, activeUsers: 920 },
        { date: '2024-02-15', unlocks: 180, newAchievements: 2, activeUsers: 1050 },
        { date: '2024-02-22', unlocks: 165, newAchievements: 0, activeUsers: 980 },
        { date: '2024-02-29', unlocks: 190, newAchievements: 1, activeUsers: 1120 },
      ],
      userEngagement: {
        totalActiveUsers: 12850,
        usersWithAchievements: 9840,
        averageAchievementsPerUser: 3.7,
        retentionRate: 84.2,
        motivationScore: 8.6,
      },
      topPerformers: [
        {
          userId: 'user-top-001',
          userName: 'Nguyễn Thành Công',
          userAvatar: 'https://i.pravatar.cc/150?img=11',
          totalAchievements: 8,
          totalPoints: 4500,
          rareAchievements: 3,
          lastAchievementDate: '2024-02-25T16:30:00Z',
          rank: 1,
        },
        {
          userId: 'user-top-002',
          userName: 'Trần Minh Đức',
          userAvatar: 'https://i.pravatar.cc/150?img=12',
          totalAchievements: 7,
          totalPoints: 3200,
          rareAchievements: 2,
          lastAchievementDate: '2024-02-23T14:15:00Z',
          rank: 2,
        },
        {
          userId: 'user-top-003',
          userName: 'Lê Thị Hương',
          userAvatar: 'https://i.pravatar.cc/150?img=13',
          totalAchievements: 6,
          totalPoints: 2800,
          rareAchievements: 2,
          lastAchievementDate: '2024-02-20T11:45:00Z',
          rank: 3,
        },
      ],
    };
  }

  /**
   * Calculate achievement statistics
   */
  private static calculateStats(): AchievementStats {
    const totalAchievements = allAchievements.length;
    const activeAchievements = allAchievements.filter((a) => a.status === 'active').length;
    const totalUnlocks = allAchievements.reduce((sum, a) => sum + a.unlockedCount, 0);
    const averageUnlocksPerUser = totalUnlocks / 15420; // Mock total users

    // Calculate most popular category
    const categoryCount: Record<AchievementCategory, number> = {} as any;
    allAchievements.forEach((a) => {
      categoryCount[a.category] = (categoryCount[a.category] || 0) + a.unlockedCount;
    });
    const mostPopularCategory = Object.entries(categoryCount).reduce((a, b) =>
      categoryCount[a[0] as AchievementCategory] > categoryCount[b[0] as AchievementCategory]
        ? a
        : b,
    )[0] as AchievementCategory;

    // Calculate rarity distribution
    const rarityDistribution = {
      common: allAchievements.filter((a) => a.rarity === 'common').length,
      rare: allAchievements.filter((a) => a.rarity === 'rare').length,
      epic: allAchievements.filter((a) => a.rarity === 'epic').length,
      legendary: allAchievements.filter((a) => a.rarity === 'legendary').length,
    };

    // Get top achievements
    const topAchievements: TopAchievement[] = allAchievements
      .sort((a, b) => b.unlockedCount - a.unlockedCount)
      .slice(0, 5)
      .map((a) => ({
        id: a.id,
        name: a.name,
        icon: a.icon,
        category: a.category,
        rarity: a.rarity,
        unlockCount: a.unlockedCount,
        unlockRate: a.unlockRate,
        trend: 'stable' as const, // Mock trend
      }));

    return {
      totalAchievements,
      activeAchievements,
      totalUnlocks,
      averageUnlocksPerUser: Math.round(averageUnlocksPerUser * 10) / 10,
      mostPopularCategory,
      rarityDistribution,
      recentUnlocks: recentUnlocks.slice(0, 5),
      topAchievements,
    };
  }

  /**
   * Get rarity color
   */
  static getRarityColor(rarity: AchievementRarity): string {
    const colorMap = {
      common: '#8c8c8c',
      rare: '#1890ff',
      epic: '#722ed1',
      legendary: '#faad14',
    };
    return colorMap[rarity];
  }

  /**
   * Get category color
   */
  static getCategoryColor(category: AchievementCategory): string {
    const colorMap = {
      learning: '#1890ff',
      skill: '#52c41a',
      time: '#faad14',
      social: '#722ed1',
      milestone: '#eb2f96',
      special: '#13c2c2',
    };
    return colorMap[category];
  }

  /**
   * Format points with abbreviation
   */
  static formatPoints(points: number): string {
    if (points >= 1000) {
      return (points / 1000).toFixed(1) + 'K';
    }
    return points.toString();
  }

  /**
   * Get time ago string
   */
  static getTimeAgo(timestamp: string): string {
    const now = new Date();
    const time = new Date(timestamp);
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
   * Format percentage
   */
  static formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
  }
}

export default AchievementApiService;
