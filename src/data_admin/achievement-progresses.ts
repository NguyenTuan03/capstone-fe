import { AchievementProgress } from '@/types/achievement-progress';
import { achievements } from './achievements';
import { users } from './users';

// Achievement Progresses - Tiến độ của learners trên các achievement
// Track progress từ 0-100%
export const achievementProgresses: AchievementProgress[] = [
  // Learner 1 (Nguyễn Văn An - user id 14) - Beginner level
  {
    id: 1,
    currentProgress: 100, // Completed 'Người mới bắt đầu'
    updatedAt: new Date('2024-02-01'),
    achievement: achievements[0], // First session
    user: users[13],
  },
  {
    id: 2,
    currentProgress: 30, // 3/10 sessions
    updatedAt: new Date('2024-02-08'),
    achievement: achievements[1], // 10 sessions
    user: users[13],
  },
  {
    id: 3,
    currentProgress: 40, // 2/5 courses
    updatedAt: new Date('2024-02-01'),
    achievement: achievements[3], // 5 courses
    user: users[13],
  },

  // Learner 2 (Trần Thị Bình - user id 15)
  {
    id: 4,
    currentProgress: 100,
    updatedAt: new Date('2024-02-01'),
    achievement: achievements[0], // First session
    user: users[14],
  },
  {
    id: 5,
    currentProgress: 30,
    updatedAt: new Date('2024-02-08'),
    achievement: achievements[1], // 10 sessions
    user: users[14],
  },
  {
    id: 6,
    currentProgress: 20, // 1/5 perfect quiz scores
    updatedAt: new Date('2024-02-05'),
    achievement: achievements[5], // Perfect quiz
    user: users[14],
  },

  // Learner 3 (Lê Văn Cảnh - user id 16) - Intermediate level
  {
    id: 7,
    currentProgress: 100,
    updatedAt: new Date('2024-01-25'),
    achievement: achievements[0], // First session
    user: users[15],
  },
  {
    id: 8,
    currentProgress: 50, // 5/10 sessions
    updatedAt: new Date('2024-02-08'),
    achievement: achievements[1], // 10 sessions
    user: users[15],
  },
  {
    id: 9,
    currentProgress: 100, // Reached INTERMEDIATE
    updatedAt: new Date('2024-02-01'),
    achievement: achievements[7], // Intermediate level
    user: users[15],
  },
  {
    id: 10,
    currentProgress: 60, // 3/5 courses
    updatedAt: new Date('2024-02-01'),
    achievement: achievements[3], // 5 courses
    user: users[15],
  },

  // Learner 10 (Đinh Thị Kim - user id 23) - Advanced level, very active
  {
    id: 11,
    currentProgress: 100,
    updatedAt: new Date('2024-01-15'),
    achievement: achievements[0], // First session
    user: users[22],
  },
  {
    id: 12,
    currentProgress: 90, // 9/10 sessions
    updatedAt: new Date('2024-02-08'),
    achievement: achievements[1], // 10 sessions
    user: users[22],
  },
  {
    id: 13,
    currentProgress: 100, // Reached ADVANCED
    updatedAt: new Date('2024-01-20'),
    achievement: achievements[8], // Advanced level
    user: users[22],
  },
  {
    id: 14,
    currentProgress: 80, // 4/5 courses
    updatedAt: new Date('2024-02-01'),
    achievement: achievements[3], // 5 courses
    user: users[22],
  },
  {
    id: 15,
    currentProgress: 100, // 5/5 perfect scores
    updatedAt: new Date('2024-02-05'),
    achievement: achievements[5], // Perfect quiz
    user: users[22],
  },
  {
    id: 16,
    currentProgress: 100, // Average score >= 90%
    updatedAt: new Date('2024-02-05'),
    achievement: achievements[10], // High score
    user: users[22],
  },

  // Learner 5 (Hoàng Văn Em - user id 18) - Intermediate
  {
    id: 17,
    currentProgress: 100,
    updatedAt: new Date('2024-01-28'),
    achievement: achievements[0], // First session
    user: users[17],
  },
  {
    id: 18,
    currentProgress: 40, // 4/10 sessions
    updatedAt: new Date('2024-02-08'),
    achievement: achievements[1], // 10 sessions
    user: users[17],
  },
  {
    id: 19,
    currentProgress: 100, // Reached INTERMEDIATE
    updatedAt: new Date('2024-01-28'),
    achievement: achievements[7], // Intermediate level
    user: users[17],
  },
  {
    id: 20,
    currentProgress: 60, // 3/5 sessions streak
    updatedAt: new Date('2024-02-05'),
    achievement: achievements[13], // 5 session streak
    user: users[17],
  },

  // Learner 8 (Bùi Thị Hà - user id 21) - Intermediate
  {
    id: 21,
    currentProgress: 100,
    updatedAt: new Date('2024-01-25'),
    achievement: achievements[0], // First session
    user: users[20],
  },
  {
    id: 22,
    currentProgress: 50, // 5/10 sessions
    updatedAt: new Date('2024-02-08'),
    achievement: achievements[1], // 10 sessions
    user: users[20],
  },
  {
    id: 23,
    currentProgress: 100, // Reached INTERMEDIATE
    updatedAt: new Date('2024-02-01'),
    achievement: achievements[7], // Intermediate level
    user: users[20],
  },

  // Learner 11 (Lý Văn Long - user id 24) - Intermediate
  {
    id: 24,
    currentProgress: 100,
    updatedAt: new Date('2024-02-01'),
    achievement: achievements[0], // First session
    user: users[23],
  },
  {
    id: 25,
    currentProgress: 40, // 4/10 sessions
    updatedAt: new Date('2024-02-08'),
    achievement: achievements[1], // 10 sessions
    user: users[23],
  },
  {
    id: 26,
    currentProgress: 100, // Reached INTERMEDIATE
    updatedAt: new Date('2024-02-01'),
    achievement: achievements[7], // Intermediate level
    user: users[23],
  },
  {
    id: 27,
    currentProgress: 80, // 4/5 perfect scores
    updatedAt: new Date('2024-02-08'),
    achievement: achievements[5], // Perfect quiz
    user: users[23],
  },

  // Learner 13 (Mai Văn Nam - user id 26) - Advanced
  {
    id: 28,
    currentProgress: 100,
    updatedAt: new Date('2024-01-22'),
    achievement: achievements[0], // First session
    user: users[25],
  },
  {
    id: 29,
    currentProgress: 70, // 7/10 sessions
    updatedAt: new Date('2024-02-12'),
    achievement: achievements[1], // 10 sessions
    user: users[25],
  },
  {
    id: 30,
    currentProgress: 100, // Reached ADVANCED
    updatedAt: new Date('2024-02-05'),
    achievement: achievements[8], // Advanced level
    user: users[25],
  },
  {
    id: 31,
    currentProgress: 100, // 5/5 courses
    updatedAt: new Date('2024-02-08'),
    achievement: achievements[3], // 5 courses
    user: users[25],
  },

  // Learner 15 (Đặng Văn Phúc - user id 28) - Intermediate
  {
    id: 32,
    currentProgress: 100,
    updatedAt: new Date('2024-02-01'),
    achievement: achievements[0], // First session
    user: users[27],
  },
  {
    id: 33,
    currentProgress: 30, // 3/10 sessions
    updatedAt: new Date('2024-02-08'),
    achievement: achievements[1], // 10 sessions
    user: users[27],
  },
  {
    id: 34,
    currentProgress: 100, // Reached INTERMEDIATE
    updatedAt: new Date('2024-02-01'),
    achievement: achievements[7], // Intermediate level
    user: users[27],
  },

  // Some learners with streak progress
  // Learner 10 with 7-day streak
  {
    id: 35,
    currentProgress: 100, // 7/7 days
    updatedAt: new Date('2024-02-07'),
    achievement: achievements[11], // 7-day streak
    user: users[22],
  },
  {
    id: 36,
    currentProgress: 23, // 7/30 days
    updatedAt: new Date('2024-02-07'),
    achievement: achievements[12], // 30-day streak
    user: users[22],
  },

  // Learner 13 with partial streaks
  {
    id: 37,
    currentProgress: 71, // 5/7 days
    updatedAt: new Date('2024-02-10'),
    achievement: achievements[11], // 7-day streak
    user: users[25],
  },
];

// Helper functions
export const getProgressById = (id: number): AchievementProgress | undefined => {
  return achievementProgresses.find((progress) => progress.id === id);
};

export const getProgressesByUserId = (userId: number): AchievementProgress[] => {
  return achievementProgresses.filter((progress) => progress.user.id === userId);
};

export const getProgressesByAchievementId = (
  achievementId: number,
): AchievementProgress[] => {
  return achievementProgresses.filter(
    (progress) => progress.achievement.id === achievementId,
  );
};

export const getCompletedProgresses = (userId: number): AchievementProgress[] => {
  return achievementProgresses.filter(
    (progress) => progress.user.id === userId && progress.currentProgress === 100,
  );
};

export const getInProgressAchievements = (
  userId: number,
): AchievementProgress[] => {
  return achievementProgresses.filter(
    (progress) =>
      progress.user.id === userId &&
      progress.currentProgress > 0 &&
      progress.currentProgress < 100,
  );
};

export const getUserProgressForAchievement = (
  userId: number,
  achievementId: number,
): AchievementProgress | undefined => {
  return achievementProgresses.find(
    (progress) =>
      progress.user.id === userId && progress.achievement.id === achievementId,
  );
};

