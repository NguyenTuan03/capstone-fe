import { Session } from './session';
import { Quiz } from './quiz';

export interface SessionQuiz {
  id: number;
  createdAt: Date;
  session: Session;
  quiz: Quiz;
}

