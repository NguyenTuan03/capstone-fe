import { LearnerAchievement } from '@/types/learner-achievement';
import { achievements } from './achievements';
import { users } from './users';

// Learner Achievements - Các thành tựu đã được learners đạt được (progress = 100%)
export const learnerAchievements: LearnerAchievement[] = [
  // Learner 1 (Nguyễn Văn An) - 1 achievement
  {
    id: 1,
    earnedAt: new Date('2024-02-01T16:30:00'),
    achievement: achievements[0], // First session
    user: users[13],
  },

  // Learner 2 (Trần Thị Bình) - 1 achievement
  {
    id: 2,
    earnedAt: new Date('2024-02-01T16:35:00'),
    achievement: achievements[0], // First session
    user: users[14],
  },

  // Learner 3 (Lê Văn Cảnh) - 2 achievements
  {
    id: 3,
    earnedAt: new Date('2024-01-25T18:00:00'),
    achievement: achievements[0], // First session
    user: users[15],
  },
  {
    id: 4,
    earnedAt: new Date('2024-02-01T10:00:00'),
    achievement: achievements[7], // Intermediate level
    user: users[15],
  },

  // Learner 10 (Đinh Thị Kim) - 5 achievements (most active)
  {
    id: 5,
    earnedAt: new Date('2024-01-15T11:30:00'),
    achievement: achievements[0], // First session
    user: users[22],
  },
  {
    id: 6,
    earnedAt: new Date('2024-01-20T09:00:00'),
    achievement: achievements[7], // Intermediate level
    user: users[22],
  },
  {
    id: 7,
    earnedAt: new Date('2024-01-25T09:00:00'),
    achievement: achievements[8], // Advanced level
    user: users[22],
  },
  {
    id: 8,
    earnedAt: new Date('2024-02-05T11:40:00'),
    achievement: achievements[5], // Perfect quiz 5 times
    user: users[22],
  },
  {
    id: 9,
    earnedAt: new Date('2024-02-05T11:45:00'),
    achievement: achievements[10], // High score average
    user: users[22],
  },
  {
    id: 10,
    earnedAt: new Date('2024-02-07T19:00:00'),
    achievement: achievements[11], // 7-day streak
    user: users[22],
  },

  // Learner 5 (Hoàng Văn Em) - 2 achievements
  {
    id: 11,
    earnedAt: new Date('2024-01-28T18:00:00'),
    achievement: achievements[0], // First session
    user: users[17],
  },
  {
    id: 12,
    earnedAt: new Date('2024-01-28T20:00:00'),
    achievement: achievements[7], // Intermediate level
    user: users[17],
  },

  // Learner 8 (Bùi Thị Hà) - 2 achievements
  {
    id: 13,
    earnedAt: new Date('2024-01-25T18:00:00'),
    achievement: achievements[0], // First session
    user: users[20],
  },
  {
    id: 14,
    earnedAt: new Date('2024-02-01T10:30:00'),
    achievement: achievements[7], // Intermediate level
    user: users[20],
  },

  // Learner 11 (Lý Văn Long) - 2 achievements
  {
    id: 15,
    earnedAt: new Date('2024-02-01T16:45:00'),
    achievement: achievements[0], // First session
    user: users[23],
  },
  {
    id: 16,
    earnedAt: new Date('2024-02-01T17:00:00'),
    achievement: achievements[7], // Intermediate level
    user: users[23],
  },

  // Learner 13 (Mai Văn Nam) - 4 achievements
  {
    id: 17,
    earnedAt: new Date('2024-01-22T17:30:00'),
    achievement: achievements[0], // First session
    user: users[25],
  },
  {
    id: 18,
    earnedAt: new Date('2024-02-05T15:00:00'),
    achievement: achievements[7], // Intermediate level
    user: users[25],
  },
  {
    id: 19,
    earnedAt: new Date('2024-02-05T15:30:00'),
    achievement: achievements[8], // Advanced level
    user: users[25],
  },
  {
    id: 20,
    earnedAt: new Date('2024-02-08T10:00:00'),
    achievement: achievements[3], // 5 courses
    user: users[25],
  },

  // Learner 15 (Đặng Văn Phúc) - 2 achievements
  {
    id: 21,
    earnedAt: new Date('2024-02-01T18:00:00'),
    achievement: achievements[0], // First session
    user: users[27],
  },
  {
    id: 22,
    earnedAt: new Date('2024-02-01T18:30:00'),
    achievement: achievements[7], // Intermediate level
    user: users[27],
  },

  // Learner 4 (Phạm Thị Diệp) - 1 achievement
  {
    id: 23,
    earnedAt: new Date('2024-02-01T16:40:00'),
    achievement: achievements[0], // First session
    user: users[16],
  },

  // Learner 6 (Vũ Thị Phương) - 1 achievement
  {
    id: 24,
    earnedAt: new Date('2024-02-01T16:30:00'),
    achievement: achievements[0], // First session
    user: users[18],
  },

  // Learner 12 (Cao Thị Minh) - 1 achievement
  {
    id: 25,
    earnedAt: new Date('2024-02-01T16:50:00'),
    achievement: achievements[0], // First session
    user: users[24],
  },

  // Learner 16 (Trương Thị Quỳnh) - 1 achievement
  {
    id: 26,
    earnedAt: new Date('2024-02-01T16:55:00'),
    achievement: achievements[0], // First session
    user: users[28],
  },

  // Learner 17 (Hồ Văn Sơn) - 2 achievements
  {
    id: 27,
    earnedAt: new Date('2024-02-01T18:00:00'),
    achievement: achievements[0], // First session
    user: users[29],
  },
  {
    id: 28,
    earnedAt: new Date('2024-02-01T19:00:00'),
    achievement: achievements[7], // Intermediate level
    user: users[29],
  },
];

// Helper functions
export const getLearnerAchievementById = (
  id: number,
): LearnerAchievement | undefined => {
  return learnerAchievements.find((la) => la.id === id);
};

export const getLearnerAchievementsByUserId = (
  userId: number,
): LearnerAchievement[] => {
  return learnerAchievements.filter((la) => la.user.id === userId);
};

export const getLearnerAchievementsByAchievementId = (
  achievementId: number,
): LearnerAchievement[] => {
  return learnerAchievements.filter(
    (la) => la.achievement.id === achievementId,
  );
};

export const getUserAchievementCount = (userId: number): number => {
  return getLearnerAchievementsByUserId(userId).length;
};

export const getTopAchievers = (limit: number = 10): Array<{
  user: any;
  count: number;
}> => {
  const userCounts = new Map<number, number>();
  
  learnerAchievements.forEach((la) => {
    const userId = la.user.id;
    userCounts.set(userId, (userCounts.get(userId) || 0) + 1);
  });

  return Array.from(userCounts.entries())
    .map(([userId, count]) => ({
      user: users.find((u) => u.id === userId),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const getMostEarnedAchievements = (
  limit: number = 10,
): Array<{ achievement: any; count: number }> => {
  const achievementCounts = new Map<number, number>();

  learnerAchievements.forEach((la) => {
    const achievementId = la.achievement.id;
    achievementCounts.set(
      achievementId,
      (achievementCounts.get(achievementId) || 0) + 1,
    );
  });

  return Array.from(achievementCounts.entries())
    .map(([achievementId, count]) => ({
      achievement: achievements.find((a) => a.id === achievementId),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const hasUserEarnedAchievement = (
  userId: number,
  achievementId: number,
): boolean => {
  return learnerAchievements.some(
    (la) => la.user.id === userId && la.achievement.id === achievementId,
  );
};

