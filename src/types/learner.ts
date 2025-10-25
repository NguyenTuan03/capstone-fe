import { PickleballLevel } from './enums';
import { User } from './user';

export interface Learner {
  id: number;
  skillLevel: PickleballLevel;
  learningGoal: PickleballLevel;
  user: User;
}

