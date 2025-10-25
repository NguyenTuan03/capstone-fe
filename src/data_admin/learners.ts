import { Learner } from '@/types/learner';
import { PickleballLevel } from '@/types/enums';
import { users, getLearnerUsers } from './users';

// 17 learners - mapping to user IDs 14-30
export const learners: Learner[] = [
  {
    id: 1,
    skillLevel: PickleballLevel.BEGINNER,
    learningGoal: PickleballLevel.INTERMEDIATE,
    user: users[13], // Nguyễn Văn An (id: 14)
  },
  {
    id: 2,
    skillLevel: PickleballLevel.BEGINNER,
    learningGoal: PickleballLevel.ADVANCED,
    user: users[14], // Trần Thị Bình (id: 15)
  },
  {
    id: 3,
    skillLevel: PickleballLevel.INTERMEDIATE,
    learningGoal: PickleballLevel.ADVANCED,
    user: users[15], // Lê Văn Cảnh (id: 16)
  },
  {
    id: 4,
    skillLevel: PickleballLevel.BEGINNER,
    learningGoal: PickleballLevel.INTERMEDIATE,
    user: users[16], // Phạm Thị Diệp (id: 17)
  },
  {
    id: 5,
    skillLevel: PickleballLevel.INTERMEDIATE,
    learningGoal: PickleballLevel.PROFESSIONAL,
    user: users[17], // Hoàng Văn Em (id: 18)
  },
  {
    id: 6,
    skillLevel: PickleballLevel.BEGINNER,
    learningGoal: PickleballLevel.INTERMEDIATE,
    user: users[18], // Vũ Thị Phương (id: 19)
  },
  {
    id: 7,
    skillLevel: PickleballLevel.BEGINNER,
    learningGoal: PickleballLevel.INTERMEDIATE,
    user: users[19], // Đỗ Văn Giang (id: 20)
  },
  {
    id: 8,
    skillLevel: PickleballLevel.INTERMEDIATE,
    learningGoal: PickleballLevel.ADVANCED,
    user: users[20], // Bùi Thị Hà (id: 21)
  },
  {
    id: 9,
    skillLevel: PickleballLevel.BEGINNER,
    learningGoal: PickleballLevel.BEGINNER,
    user: users[21], // Ngô Văn Ích (id: 22) - Inactive
  },
  {
    id: 10,
    skillLevel: PickleballLevel.ADVANCED,
    learningGoal: PickleballLevel.PROFESSIONAL,
    user: users[22], // Đinh Thị Kim (id: 23)
  },
  {
    id: 11,
    skillLevel: PickleballLevel.INTERMEDIATE,
    learningGoal: PickleballLevel.ADVANCED,
    user: users[23], // Lý Văn Long (id: 24)
  },
  {
    id: 12,
    skillLevel: PickleballLevel.BEGINNER,
    learningGoal: PickleballLevel.INTERMEDIATE,
    user: users[24], // Cao Thị Minh (id: 25)
  },
  {
    id: 13,
    skillLevel: PickleballLevel.ADVANCED,
    learningGoal: PickleballLevel.PROFESSIONAL,
    user: users[25], // Mai Văn Nam (id: 26)
  },
  {
    id: 14,
    skillLevel: PickleballLevel.BEGINNER,
    learningGoal: PickleballLevel.ADVANCED,
    user: users[26], // Tô Thị Oanh (id: 27)
  },
  {
    id: 15,
    skillLevel: PickleballLevel.INTERMEDIATE,
    learningGoal: PickleballLevel.ADVANCED,
    user: users[27], // Đặng Văn Phúc (id: 28)
  },
  {
    id: 16,
    skillLevel: PickleballLevel.BEGINNER,
    learningGoal: PickleballLevel.INTERMEDIATE,
    user: users[28], // Trương Thị Quỳnh (id: 29)
  },
  {
    id: 17,
    skillLevel: PickleballLevel.INTERMEDIATE,
    learningGoal: PickleballLevel.PROFESSIONAL,
    user: users[29], // Hồ Văn Sơn (id: 30)
  },
];

// Helper functions
export const getLearnerById = (id: number): Learner | undefined => {
  return learners.find((learner) => learner.id === id);
};

export const getLearnersBySkillLevel = (level: PickleballLevel): Learner[] => {
  return learners.filter((learner) => learner.skillLevel === level);
};

export const getLearnersByGoal = (goal: PickleballLevel): Learner[] => {
  return learners.filter((learner) => learner.learningGoal === goal);
};

export const getActiveLearners = (): Learner[] => {
  return learners.filter((learner) => learner.user.isActive);
};

