import { PickleballLevel } from './enums';
import { Question } from './question';
import { SessionQuiz } from './session-quiz';
import { User } from './user';

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  level: PickleballLevel;
  totalQuestions: number;
  questions?: Question[];
  sessionQuizzes?: SessionQuiz[];
  createdBy: User;
}
