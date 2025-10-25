import { Session } from './session';
import { LearnerAnswer } from './learner-answer';
import { User } from './user';

export interface QuizAttempt {
  id: number;
  attemptNumber: number;
  score: number;
  createdAt: Date;
  attemptedBy: User;
  session: Session;
  learnerAnswers?: LearnerAnswer[];
}
