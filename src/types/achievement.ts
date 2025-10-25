import { AchievementType } from './enums';
import { User } from './user';
import { AchievementProgress } from './achievement-progress';
import { LearnerAchievement } from './learner-achievement';

// Base Achievement interface
export interface Achievement {
  id: number;
  name: string;
  description?: string;
  iconUrl?: string;
  isActive: boolean;
  createdAt: Date;
  type?: AchievementType; // For discriminating between types
  achievementProgresses?: AchievementProgress[];
  learnerAchievements?: LearnerAchievement[];
  createdBy: User;
}

// EventCountAchievement - Đếm số lần event xảy ra
export interface EventCountAchievement extends Achievement {
  type: AchievementType.EVENT_COUNT;
  eventName: string;
  targetCount: number;
}

// PropertyCheckAchievement - Kiểm tra thuộc tính của entity
export interface PropertyCheckAchievement extends Achievement {
  type: AchievementType.PROPERTY_CHECK;
  eventName: string;
  entityName: string;
  propertyName: string;
  comparisonOperator: string;
  targetValue: string;
}

// StreakAchievement - Đếm chuỗi liên tiếp
export interface StreakAchievement extends Achievement {
  type: AchievementType.STREAK;
  eventName: string;
  targetStreakLength: number;
  streakUnit: string;
}

// Union type for all achievement types
export type AnyAchievement = EventCountAchievement | PropertyCheckAchievement | StreakAchievement;
