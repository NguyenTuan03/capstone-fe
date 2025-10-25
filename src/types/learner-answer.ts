import { Question } from './question';
import { QuestionOption } from './question-option';
import { QuizAttempt } from './quiz-attempt';

export interface LearnerAnswer {
  id: number;
  isCorrect: boolean;
  answeredAt: Date;
  question: Question;
  selectedOption: QuestionOption;
  quizAttempt: QuizAttempt;
}
