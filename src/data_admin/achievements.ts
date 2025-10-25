import {
  Achievement,
  EventCountAchievement,
  PropertyCheckAchievement,
  StreakAchievement,
  AnyAchievement,
} from '@/types/achievement';
import { AchievementType } from '@/types/enums';
import { users } from './users';

// Achievements - Hệ thống thành tựu cho learners
// Created by admin (user id 1)
export const achievements: AnyAchievement[] = [
  // EVENT_COUNT Achievements - Đếm số lần event
  {
    id: 1,
    type: AchievementType.EVENT_COUNT,
    name: 'Người mới bắt đầu',
    description: 'Hoàn thành buổi học đầu tiên',
    iconUrl: '/icons/achievements/first-session.png',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    eventName: 'session_completed',
    targetCount: 1,
    createdBy: users[0], // Admin
  },
  {
    id: 2,
    type: AchievementType.EVENT_COUNT,
    name: 'Học sinh chăm chỉ',
    description: 'Hoàn thành 10 buổi học',
    iconUrl: '/icons/achievements/10-sessions.png',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    eventName: 'session_completed',
    targetCount: 10,
    createdBy: users[0],
  },
  {
    id: 3,
    type: AchievementType.EVENT_COUNT,
    name: 'Chuyên gia',
    description: 'Hoàn thành 50 buổi học',
    iconUrl: '/icons/achievements/50-sessions.png',
    isActive: false, // Tạm ngưng
    createdAt: new Date('2024-01-01'),
    eventName: 'session_completed',
    targetCount: 50,
    createdBy: users[0],
  },
  {
    id: 4,
    type: AchievementType.EVENT_COUNT,
    name: 'Người đam mê',
    description: 'Tham gia 5 khóa học',
    iconUrl: '/icons/achievements/5-courses.png',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    eventName: 'course_enrolled',
    targetCount: 5,
    createdBy: users[0],
  },
  {
    id: 5,
    type: AchievementType.EVENT_COUNT,
    name: 'Thạc sĩ Pickleball',
    description: 'Hoàn thành 10 khóa học',
    iconUrl: '/icons/achievements/10-courses.png',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    eventName: 'course_completed',
    targetCount: 10,
    createdBy: users[0],
  },
  {
    id: 6,
    type: AchievementType.EVENT_COUNT,
    name: 'Học trò xuất sắc',
    description: 'Đạt điểm 100% trong 5 quiz',
    iconUrl: '/icons/achievements/perfect-quiz.png',
    isActive: false, // Tạm ngưng
    createdAt: new Date('2024-01-01'),
    eventName: 'quiz_perfect_score',
    targetCount: 5,
    createdBy: users[0],
  },
  {
    id: 7,
    type: AchievementType.EVENT_COUNT,
    name: 'Người đóng góp',
    description: 'Gửi 10 feedback cho các khóa học',
    iconUrl: '/icons/achievements/feedback.png',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    eventName: 'feedback_submitted',
    targetCount: 10,
    createdBy: users[0],
  },

  // PROPERTY_CHECK Achievements - Kiểm tra thuộc tính
  {
    id: 8,
    type: AchievementType.PROPERTY_CHECK,
    name: 'Học sinh trung cấp',
    description: 'Đạt level Intermediate',
    iconUrl: '/icons/achievements/intermediate.png',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    eventName: 'learner_level_updated',
    entityName: 'Learner',
    propertyName: 'skillLevel',
    comparisonOperator: '>=',
    targetValue: 'INTERMEDIATE',
    createdBy: users[0],
  },
  {
    id: 9,
    type: AchievementType.PROPERTY_CHECK,
    name: 'Học sinh nâng cao',
    description: 'Đạt level Advanced',
    iconUrl: '/icons/achievements/advanced.png',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    eventName: 'learner_level_updated',
    entityName: 'Learner',
    propertyName: 'skillLevel',
    comparisonOperator: '>=',
    targetValue: 'ADVANCED',
    createdBy: users[0],
  },
  {
    id: 10,
    type: AchievementType.PROPERTY_CHECK,
    name: 'Chuyên gia chuyên nghiệp',
    description: 'Đạt level Professional',
    iconUrl: '/icons/achievements/professional.png',
    isActive: false, // Tạm ngưng
    createdAt: new Date('2024-01-01'),
    eventName: 'learner_level_updated',
    entityName: 'Learner',
    propertyName: 'skillLevel',
    comparisonOperator: '==',
    targetValue: 'PROFESSIONAL',
    createdBy: users[0],
  },
  {
    id: 11,
    type: AchievementType.PROPERTY_CHECK,
    name: 'Học sinh ưu tú',
    description: 'Đạt điểm trung bình quiz trên 90%',
    iconUrl: '/icons/achievements/high-score.png',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    eventName: 'quiz_completed',
    entityName: 'QuizAttempt',
    propertyName: 'averageScore',
    comparisonOperator: '>=',
    targetValue: '90',
    createdBy: users[0],
  },

  // STREAK Achievements - Chuỗi liên tiếp
  {
    id: 12,
    type: AchievementType.STREAK,
    name: 'Kiên trì 7 ngày',
    description: 'Tham gia buổi học 7 ngày liên tiếp',
    iconUrl: '/icons/achievements/7-day-streak.png',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    eventName: 'session_attended',
    targetStreakLength: 7,
    streakUnit: 'days',
    createdBy: users[0],
  },
  {
    id: 13,
    type: AchievementType.STREAK,
    name: 'Kiên trì 30 ngày',
    description: 'Tham gia buổi học 30 ngày liên tiếp',
    iconUrl: '/icons/achievements/30-day-streak.png',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    eventName: 'session_attended',
    targetStreakLength: 30,
    streakUnit: 'days',
    createdBy: users[0],
  },
  {
    id: 14,
    type: AchievementType.STREAK,
    name: 'Không bỏ lỡ',
    description: 'Hoàn thành 5 buổi học liên tiếp không nghỉ',
    iconUrl: '/icons/achievements/5-session-streak.png',
    isActive: false, // Tạm ngưng
    createdAt: new Date('2024-01-01'),
    eventName: 'session_completed',
    targetStreakLength: 5,
    streakUnit: 'sessions',
    createdBy: users[0],
  },
  {
    id: 15,
    type: AchievementType.STREAK,
    name: 'Học ba tuần liên tục',
    description: 'Học ít nhất 1 buổi mỗi tuần trong 3 tuần',
    iconUrl: '/icons/achievements/3-week-streak.png',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    eventName: 'weekly_activity',
    targetStreakLength: 3,
    streakUnit: 'weeks',
    createdBy: users[0],
  },

  // More EVENT_COUNT achievements
  {
    id: 16,
    type: AchievementType.EVENT_COUNT,
    name: 'Người xem video tích cực',
    description: 'Xem 20 video hướng dẫn',
    iconUrl: '/icons/achievements/video-viewer.png',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    eventName: 'video_watched',
    targetCount: 20,
    createdBy: users[0],
  },
  {
    id: 17,
    type: AchievementType.EVENT_COUNT,
    name: 'Thành viên cộng đồng',
    description: 'Tương tác với 10 học viên khác',
    iconUrl: '/icons/achievements/community.png',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    eventName: 'peer_interaction',
    targetCount: 10,
    createdBy: users[0],
  },
  {
    id: 18,
    type: AchievementType.EVENT_COUNT,
    name: 'Người học tập không ngừng',
    description: 'Hoàn thành 100 quiz',
    iconUrl: '/icons/achievements/100-quizzes.png',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    eventName: 'quiz_completed',
    targetCount: 100,
    createdBy: users[0],
  },

  // Inactive achievement (for testing)
  {
    id: 19,
    type: AchievementType.EVENT_COUNT,
    name: 'Thành tựu cũ',
    description: 'Thành tựu này đã ngừng hoạt động',
    iconUrl: '/icons/achievements/old.png',
    isActive: false,
    createdAt: new Date('2023-01-01'),
    eventName: 'deprecated_event',
    targetCount: 1,
    createdBy: users[0],
  },

  // Special achievements
  {
    id: 20,
    type: AchievementType.PROPERTY_CHECK,
    name: 'Người sáng tạo',
    description: 'Tạo video hướng dẫn đầu tiên',
    iconUrl: '/icons/achievements/creator.png',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    eventName: 'video_uploaded',
    entityName: 'Video',
    propertyName: 'uploadCount',
    comparisonOperator: '>=',
    targetValue: '1',
    createdBy: users[0],
  },
];

// Helper functions
export const getAchievementById = (id: number): AnyAchievement | undefined => {
  return achievements.find((achievement) => achievement.id === id);
};

export const getActiveAchievements = (): AnyAchievement[] => {
  return achievements.filter((achievement) => achievement.isActive);
};

export const getAchievementsByType = (
  type: AchievementType,
): AnyAchievement[] => {
  return achievements.filter((achievement) => achievement.type === type);
};

export const getAchievementsByCreator = (creatorId: number): AnyAchievement[] => {
  return achievements.filter((achievement) => achievement.createdBy.id === creatorId);
};

export const getEventCountAchievements = (): EventCountAchievement[] => {
  return achievements.filter(
    (a) => a.type === AchievementType.EVENT_COUNT,
  ) as EventCountAchievement[];
};

export const getPropertyCheckAchievements = (): PropertyCheckAchievement[] => {
  return achievements.filter(
    (a) => a.type === AchievementType.PROPERTY_CHECK,
  ) as PropertyCheckAchievement[];
};

export const getStreakAchievements = (): StreakAchievement[] => {
  return achievements.filter(
    (a) => a.type === AchievementType.STREAK,
  ) as StreakAchievement[];
};

export const getAchievementsByEventName = (
  eventName: string,
): AnyAchievement[] => {
  return achievements.filter((a) => {
    if (a.type === AchievementType.EVENT_COUNT) {
      return (a as EventCountAchievement).eventName === eventName;
    }
    if (a.type === AchievementType.PROPERTY_CHECK) {
      return (a as PropertyCheckAchievement).eventName === eventName;
    }
    if (a.type === AchievementType.STREAK) {
      return (a as StreakAchievement).eventName === eventName;
    }
    return false;
  });
};
