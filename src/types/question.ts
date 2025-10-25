import { Quiz } from './quiz';
import { QuestionOption } from './question-option';
import { LearnerAnswer } from './learner-answer';

export interface Question {
  id: number;
  title: string;
  explanation?: string;
  quiz: Quiz;
  options?: QuestionOption[];
  learnerAnswers?: LearnerAnswer[];
}
