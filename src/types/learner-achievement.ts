import { Achievement } from './achievement';
import { User } from './user';

export interface LearnerAchievement {
  id: number;
  earnedAt: Date;
  achievement: Achievement;
  user: User; // Learner user
}

