import {
  Achievement,
  EventCountAchievement,
  PropertyCheckAchievement,
  StreakAchievement,
} from '@/types/achievement';
import { AchievementProgress } from '@/types/achievement-progress';
import { LearnerAchievement } from '@/types/learner-achievement';
import {
  achievements,
  getAchievementById,
  getActiveAchievements,
  getAchievementsByType,
  getAchievementsByCreator,
} from '@/data_admin/achievements';
import {
  achievementProgresses,
  getProgressById,
  getProgressesByUserId,
  getProgressesByAchievementId,
  getCompletedProgresses,
  getInProgressAchievements,
  getUserProgressForAchievement,
} from '@/data_admin/achievement-progresses';
import {
  learnerAchievements,
  getLearnerAchievementById,
  getLearnerAchievementsByUserId,
  getLearnerAchievementsByAchievementId,
  getUserAchievementCount,
  getTopAchievers,
  getMostEarnedAchievements,
  hasUserEarnedAchievement,
} from '@/data_admin/learner-achievements';
import { AchievementType } from '@/types/enums';

// API Response Types
export interface AchievementListResponse {
  data: Achievement[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AchievementProgressResponse {
  data: AchievementProgress[];
  total: number;
}

export interface LearnerAchievementResponse {
  data: LearnerAchievement[];
  total: number;
}

export interface AchievementStatsResponse {
  totalAchievements: number;
  activeAchievements: number;
  totalEarned: number;
  byType: {
    [key: string]: number;
  };
}

export interface UserAchievementSummary {
  userId: number;
  totalEarned: number;
  inProgress: number;
  notStarted: number;
  completionRate: number;
  recentAchievements: LearnerAchievement[];
}

// Achievement API functions
export const achievementApi = {
  // Get all achievements
  getAllAchievements: async (params?: {
    page?: number;
    pageSize?: number;
    isActive?: boolean;
    type?: AchievementType;
    creatorId?: number;
  }): Promise<AchievementListResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    let filtered = [...achievements];

    if (params?.isActive !== undefined) {
      filtered = filtered.filter((a) => a.isActive === params.isActive);
    }

    if (params?.type) {
      filtered = getAchievementsByType(params.type);
    }

    if (params?.creatorId) {
      filtered = getAchievementsByCreator(params.creatorId);
    }

    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      pageSize,
    };
  },

  // Get achievement by ID
  getAchievementById: async (id: number): Promise<Achievement | null> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return getAchievementById(id) || null;
  },

  // Get active achievements
  getActiveAchievements: async (): Promise<Achievement[]> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return getActiveAchievements();
  },

  // Get achievements by type
  getAchievementsByType: async (
    type: AchievementType,
  ): Promise<Achievement[]> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return getAchievementsByType(type);
  },

  // Get achievement statistics
  getAchievementStats: async (): Promise<AchievementStatsResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const active = getActiveAchievements();
    const byType = achievements.reduce(
      (acc, achievement) => {
        acc[achievement.type] = (acc[achievement.type] || 0) + 1;
        return acc;
      },
      {} as { [key: string]: number },
    );

    return {
      totalAchievements: achievements.length,
      activeAchievements: active.length,
      totalEarned: learnerAchievements.length,
      byType,
    };
  },
};

// Achievement Progress API functions
export const achievementProgressApi = {
  // Get all progress for a user
  getUserProgress: async (
    userId: number,
  ): Promise<AchievementProgressResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const data = getProgressesByUserId(userId);

    return {
      data,
      total: data.length,
    };
  },

  // Get progress for specific achievement
  getProgressByAchievement: async (
    achievementId: number,
  ): Promise<AchievementProgressResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const data = getProgressesByAchievementId(achievementId);

    return {
      data,
      total: data.length,
    };
  },

  // Get completed progress for user
  getCompletedProgress: async (userId: number): Promise<AchievementProgress[]> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return getCompletedProgresses(userId);
  },

  // Get in-progress achievements for user
  getInProgressAchievements: async (
    userId: number,
  ): Promise<AchievementProgress[]> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return getInProgressAchievements(userId);
  },

  // Get specific user progress for achievement
  getUserAchievementProgress: async (
    userId: number,
    achievementId: number,
  ): Promise<AchievementProgress | null> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return getUserProgressForAchievement(userId, achievementId) || null;
  },
};

// Learner Achievement API functions
export const learnerAchievementApi = {
  // Get all earned achievements for a user
  getUserAchievements: async (
    userId: number,
  ): Promise<LearnerAchievementResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const data = getLearnerAchievementsByUserId(userId);

    return {
      data,
      total: data.length,
    };
  },

  // Get learners who earned specific achievement
  getAchievementEarners: async (
    achievementId: number,
  ): Promise<LearnerAchievementResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const data = getLearnerAchievementsByAchievementId(achievementId);

    return {
      data,
      total: data.length,
    };
  },

  // Get user achievement count
  getUserAchievementCount: async (userId: number): Promise<number> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return getUserAchievementCount(userId);
  },

  // Get top achievers
  getTopAchievers: async (
    limit: number = 10,
  ): Promise<Array<{ user: any; count: number }>> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return getTopAchievers(limit);
  },

  // Get most earned achievements
  getMostEarnedAchievements: async (
    limit: number = 10,
  ): Promise<Array<{ achievement: Achievement; count: number }>> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return getMostEarnedAchievements(limit);
  },

  // Check if user earned achievement
  hasUserEarnedAchievement: async (
    userId: number,
    achievementId: number,
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return hasUserEarnedAchievement(userId, achievementId);
  },

  // Get user achievement summary
  getUserAchievementSummary: async (
    userId: number,
  ): Promise<UserAchievementSummary> => {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const earned = getLearnerAchievementsByUserId(userId);
    const progress = getProgressesByUserId(userId);
    const inProgress = progress.filter(
      (p) => p.currentProgress > 0 && p.currentProgress < 100,
    );
    const completed = progress.filter((p) => p.currentProgress === 100);

    const activeAchievements = getActiveAchievements();
    const notStarted = activeAchievements.length - progress.length;
    const completionRate =
      activeAchievements.length > 0
        ? (completed.length / activeAchievements.length) * 100
        : 0;

    const recentAchievements = [...earned]
      .sort((a, b) => b.earnedAt.getTime() - a.earnedAt.getTime())
      .slice(0, 5);

    return {
      userId,
      totalEarned: earned.length,
      inProgress: inProgress.length,
      notStarted,
      completionRate,
      recentAchievements,
    };
  },
};
