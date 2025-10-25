import { Achievement } from './achievement';
import { User } from './user';

export interface AchievementProgress {
  id: number;
  currentProgress: number; // 0-100
  updatedAt: Date;
  achievement: Achievement;
  user: User; // Learner user
}

