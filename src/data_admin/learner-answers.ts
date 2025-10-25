import { LearnerAnswer } from '@/types/learner-answer';
import { quizAttempts } from './quiz-attempts';
import { questions } from './questions';
import { questionOptions } from './question-options';

// Learner Answers - Câu trả lời cụ thể cho từng quiz attempt
// Mỗi attempt sẽ có câu trả lời cho các câu hỏi trong quiz

export const learnerAnswers: LearnerAnswer[] = [
  // Quiz Attempt 1 (Learner 1 - Session 1) - Score 80 (4/5 correct)
  // Questions 1-5 from Quiz 1
  {
    id: 1,
    isCorrect: true,
    answeredAt: new Date('2024-02-01T17:30:30'),
    question: questions[0], // Q1
    selectedOption: questionOptions[0], // Correct answer
    quizAttempt: quizAttempts[0],
  },
  {
    id: 2,
    isCorrect: true,
    answeredAt: new Date('2024-02-01T17:31:00'),
    question: questions[1], // Q2
    selectedOption: questionOptions[4], // Correct
    quizAttempt: quizAttempts[0],
  },
  {
    id: 3,
    isCorrect: false,
    answeredAt: new Date('2024-02-01T17:31:30'),
    question: questions[2], // Q3
    selectedOption: questionOptions[10], // Wrong answer
    quizAttempt: quizAttempts[0],
  },
  {
    id: 4,
    isCorrect: true,
    answeredAt: new Date('2024-02-01T17:32:00'),
    question: questions[3], // Q4
    selectedOption: questionOptions[12], // Correct
    quizAttempt: quizAttempts[0],
  },
  {
    id: 5,
    isCorrect: true,
    answeredAt: new Date('2024-02-01T17:32:30'),
    question: questions[4], // Q5
    selectedOption: questionOptions[16], // Correct
    quizAttempt: quizAttempts[0],
  },

  // Quiz Attempt 2 (Learner 2 - Session 1) - Score 100 (4/4 perfect)
  {
    id: 6,
    isCorrect: true,
    answeredAt: new Date('2024-02-01T17:35:20'),
    question: questions[0],
    selectedOption: questionOptions[0],
    quizAttempt: quizAttempts[1],
  },
  {
    id: 7,
    isCorrect: true,
    answeredAt: new Date('2024-02-01T17:35:50'),
    question: questions[1],
    selectedOption: questionOptions[4],
    quizAttempt: quizAttempts[1],
  },
  {
    id: 8,
    isCorrect: true,
    answeredAt: new Date('2024-02-01T17:36:20'),
    question: questions[2],
    selectedOption: questionOptions[8], // Correct
    quizAttempt: quizAttempts[1],
  },
  {
    id: 9,
    isCorrect: true,
    answeredAt: new Date('2024-02-01T17:36:50'),
    question: questions[3],
    selectedOption: questionOptions[12],
    quizAttempt: quizAttempts[1],
  },

  // Quiz Attempt 3 (Learner 1 - Session 2) - Score 85
  {
    id: 10,
    isCorrect: true,
    answeredAt: new Date('2024-02-03T11:30:30'),
    question: questions[5], // Quiz 2
    selectedOption: questionOptions[20], // Correct
    quizAttempt: quizAttempts[2],
  },
  {
    id: 11,
    isCorrect: true,
    answeredAt: new Date('2024-02-03T11:31:00'),
    question: questions[6],
    selectedOption: questionOptions[24], // Correct
    quizAttempt: quizAttempts[2],
  },
  {
    id: 12,
    isCorrect: false,
    answeredAt: new Date('2024-02-03T11:31:30'),
    question: questions[7],
    selectedOption: questionOptions[30], // Wrong
    quizAttempt: quizAttempts[2],
  },
  {
    id: 13,
    isCorrect: true,
    answeredAt: new Date('2024-02-03T11:32:00'),
    question: questions[8],
    selectedOption: questionOptions[32], // Correct
    quizAttempt: quizAttempts[2],
  },

  // Quiz Attempt 4 (Learner 2 - Session 2) - Score 90
  {
    id: 14,
    isCorrect: true,
    answeredAt: new Date('2024-02-03T11:35:20'),
    question: questions[5],
    selectedOption: questionOptions[20],
    quizAttempt: quizAttempts[3],
  },
  {
    id: 15,
    isCorrect: true,
    answeredAt: new Date('2024-02-03T11:35:50'),
    question: questions[6],
    selectedOption: questionOptions[24],
    quizAttempt: quizAttempts[3],
  },
  {
    id: 16,
    isCorrect: true,
    answeredAt: new Date('2024-02-03T11:36:20'),
    question: questions[7],
    selectedOption: questionOptions[28], // Correct
    quizAttempt: quizAttempts[3],
  },
  {
    id: 17,
    isCorrect: true,
    answeredAt: new Date('2024-02-03T11:36:50'),
    question: questions[8],
    selectedOption: questionOptions[32],
    quizAttempt: quizAttempts[3],
  },

  // Quiz Attempt 5 (Learner 1 - Session 3) - Score 75
  {
    id: 18,
    isCorrect: true,
    answeredAt: new Date('2024-02-05T15:45:30'),
    question: questions[9], // Quiz 3
    selectedOption: questionOptions[36], // Correct
    quizAttempt: quizAttempts[4],
  },
  {
    id: 19,
    isCorrect: false,
    answeredAt: new Date('2024-02-05T15:46:00'),
    question: questions[10],
    selectedOption: questionOptions[42], // Wrong
    quizAttempt: quizAttempts[4],
  },
  {
    id: 20,
    isCorrect: true,
    answeredAt: new Date('2024-02-05T15:46:30'),
    question: questions[11],
    selectedOption: questionOptions[44], // Correct
    quizAttempt: quizAttempts[4],
  },
  {
    id: 21,
    isCorrect: true,
    answeredAt: new Date('2024-02-05T15:47:00'),
    question: questions[12],
    selectedOption: questionOptions[48], // Correct
    quizAttempt: quizAttempts[4],
  },
  {
    id: 22,
    isCorrect: false,
    answeredAt: new Date('2024-02-05T15:47:30'),
    question: questions[13],
    selectedOption: questionOptions[54], // Wrong
    quizAttempt: quizAttempts[4],
  },

  // Quiz Attempt 6 (Learner 2 - Session 3) - Score 95
  {
    id: 23,
    isCorrect: true,
    answeredAt: new Date('2024-02-05T15:50:20'),
    question: questions[9],
    selectedOption: questionOptions[36],
    quizAttempt: quizAttempts[5],
  },
  {
    id: 24,
    isCorrect: true,
    answeredAt: new Date('2024-02-05T15:50:50'),
    question: questions[10],
    selectedOption: questionOptions[40], // Correct
    quizAttempt: quizAttempts[5],
  },
  {
    id: 25,
    isCorrect: true,
    answeredAt: new Date('2024-02-05T15:51:20'),
    question: questions[11],
    selectedOption: questionOptions[44],
    quizAttempt: quizAttempts[5],
  },
  {
    id: 26,
    isCorrect: true,
    answeredAt: new Date('2024-02-05T15:51:50'),
    question: questions[12],
    selectedOption: questionOptions[48],
    quizAttempt: quizAttempts[5],
  },
  {
    id: 27,
    isCorrect: true,
    answeredAt: new Date('2024-02-05T15:52:20'),
    question: questions[13],
    selectedOption: questionOptions[52], // Correct
    quizAttempt: quizAttempts[5],
  },

  // Quiz Attempt 16 (Learner 10 - Session 12) - Perfect Score 100
  {
    id: 28,
    isCorrect: true,
    answeredAt: new Date('2024-02-03T18:50:30'),
    question: questions[19], // Quiz 5
    selectedOption: questionOptions[76], // All correct
    quizAttempt: quizAttempts[15],
  },
  {
    id: 29,
    isCorrect: true,
    answeredAt: new Date('2024-02-03T18:51:00'),
    question: questions[20],
    selectedOption: questionOptions[80],
    quizAttempt: quizAttempts[15],
  },
  {
    id: 30,
    isCorrect: true,
    answeredAt: new Date('2024-02-03T18:51:30'),
    question: questions[21],
    selectedOption: questionOptions[84],
    quizAttempt: quizAttempts[15],
  },
  {
    id: 31,
    isCorrect: true,
    answeredAt: new Date('2024-02-03T18:52:00'),
    question: questions[22],
    selectedOption: questionOptions[88],
    quizAttempt: quizAttempts[15],
  },
  {
    id: 32,
    isCorrect: true,
    answeredAt: new Date('2024-02-03T18:52:30'),
    question: questions[23],
    selectedOption: questionOptions[92],
    quizAttempt: quizAttempts[15],
  },
  {
    id: 33,
    isCorrect: true,
    answeredAt: new Date('2024-02-03T18:53:00'),
    question: questions[24],
    selectedOption: questionOptions[96],
    quizAttempt: quizAttempts[15],
  },
];

// Helper functions
export const getLearnerAnswerById = (id: number): LearnerAnswer | undefined => {
  return learnerAnswers.find((answer) => answer.id === id);
};

export const getAnswersByAttempt = (attemptId: number): LearnerAnswer[] => {
  return learnerAnswers.filter((answer) => answer.quizAttempt.id === attemptId);
};

export const getAnswersByUser = (userId: number): LearnerAnswer[] => {
  return learnerAnswers.filter(
    (answer) => answer.quizAttempt.attemptedBy.id === userId,
  );
};

export const getCorrectAnswersByUser = (userId: number): LearnerAnswer[] => {
  return learnerAnswers.filter(
    (answer) => answer.quizAttempt.attemptedBy.id === userId && answer.isCorrect,
  );
};

export const getIncorrectAnswersByUser = (userId: number): LearnerAnswer[] => {
  return learnerAnswers.filter(
    (answer) => answer.quizAttempt.attemptedBy.id === userId && !answer.isCorrect,
  );
};

export const getUserAccuracyRate = (userId: number): number => {
  const userAnswers = getAnswersByUser(userId);
  if (userAnswers.length === 0) return 0;
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  return Math.round((correctCount / userAnswers.length) * 100);
};

export const getQuestionAccuracyRate = (questionId: number): number => {
  const questionAnswers = learnerAnswers.filter(
    (answer) => answer.question.id === questionId,
  );
  if (questionAnswers.length === 0) return 0;
  const correctCount = questionAnswers.filter((a) => a.isCorrect).length;
  return Math.round((correctCount / questionAnswers.length) * 100);
};

