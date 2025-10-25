import { Question } from './question';
import { LearnerAnswer } from './learner-answer';

export interface QuestionOption {
  id: number;
  content: string;
  isCorrect: boolean;
  question: Question;
  learnerAnswers?: LearnerAnswer[];
}
