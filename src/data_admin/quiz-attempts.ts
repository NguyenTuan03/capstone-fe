import { QuizAttempt } from '@/types/quiz-attempt';
import { sessions } from '@/data/sessions';
import { users } from './users';

// Quiz Attempts - Các lần làm quiz của learners
// Mỗi learner có thể làm quiz nhiều lần cho mỗi session
export const quizAttempts: QuizAttempt[] = [
  // Session 1 (Course 1) - 2 learners attempted
  {
    id: 1,
    attemptNumber: 1,
    score: 80, // 4/5 correct
    createdAt: new Date('2024-02-01T17:30:00'),
    attemptedBy: users[13], // Learner 1 - Nguyễn Văn An
    session: sessions[0],
  },
  {
    id: 2,
    attemptNumber: 1,
    score: 100, // 4/4 correct (perfect)
    createdAt: new Date('2024-02-01T17:35:00'),
    attemptedBy: users[14], // Learner 2 - Trần Thị Bình
    session: sessions[0],
  },

  // Session 2 (Course 1)
  {
    id: 3,
    attemptNumber: 1,
    score: 85,
    createdAt: new Date('2024-02-03T11:30:00'),
    attemptedBy: users[13], // Learner 1
    session: sessions[1],
  },
  {
    id: 4,
    attemptNumber: 1,
    score: 90,
    createdAt: new Date('2024-02-03T11:35:00'),
    attemptedBy: users[14], // Learner 2
    session: sessions[1],
  },

  // Session 3 (Course 1)
  {
    id: 5,
    attemptNumber: 1,
    score: 75,
    createdAt: new Date('2024-02-05T15:45:00'),
    attemptedBy: users[13], // Learner 1
    session: sessions[2],
  },
  {
    id: 6,
    attemptNumber: 1,
    score: 95,
    createdAt: new Date('2024-02-05T15:50:00'),
    attemptedBy: users[14], // Learner 2
    session: sessions[2],
  },

  // Session 4 (Course 2) - Learner 3
  {
    id: 7,
    attemptNumber: 1,
    score: 70,
    createdAt: new Date('2024-02-02T11:45:00'),
    attemptedBy: users[15], // Learner 3 - Lê Văn Cảnh
    session: sessions[3],
  },

  // Session 5 (Course 2)
  {
    id: 8,
    attemptNumber: 1,
    score: 85,
    createdAt: new Date('2024-02-04T11:50:00'),
    attemptedBy: users[15], // Learner 3
    session: sessions[4],
  },

  // Session 6 (Course 3) - Learner 4
  {
    id: 9,
    attemptNumber: 1,
    score: 65,
    createdAt: new Date('2024-02-02T17:45:00'),
    attemptedBy: users[16], // Learner 4 - Phạm Thị Diệp
    session: sessions[5],
  },
  {
    id: 10,
    attemptNumber: 2, // Second attempt, improved
    score: 80,
    createdAt: new Date('2024-02-02T18:00:00'),
    attemptedBy: users[16], // Learner 4
    session: sessions[5],
  },

  // Session 7 (Course 4) - Learner 5
  {
    id: 11,
    attemptNumber: 1,
    score: 90,
    createdAt: new Date('2024-02-03T18:50:00'),
    attemptedBy: users[17], // Learner 5 - Hoàng Văn Em
    session: sessions[6],
  },

  // Session 8 (Course 5) - Learner 6
  {
    id: 12,
    attemptNumber: 1,
    score: 75,
    createdAt: new Date('2024-02-02T17:50:00'),
    attemptedBy: users[18], // Learner 6 - Vũ Thị Phương
    session: sessions[7],
  },

  // Session 10 (Course 6) - Learner 8
  {
    id: 13,
    attemptNumber: 1,
    score: 85,
    createdAt: new Date('2024-02-03T11:50:00'),
    attemptedBy: users[20], // Learner 8 - Bùi Thị Hà
    session: sessions[9],
  },

  // Session 11 (Course 7) - Learner 9
  {
    id: 14,
    attemptNumber: 1,
    score: 60,
    createdAt: new Date('2024-02-02T12:50:00'),
    attemptedBy: users[21], // Learner 9 - Phan Văn Inh
    session: sessions[10],
  },
  {
    id: 15,
    attemptNumber: 2, // Retake
    score: 75,
    createdAt: new Date('2024-02-02T13:10:00'),
    attemptedBy: users[21], // Learner 9
    session: sessions[10],
  },

  // Session 12 (Course 8) - Learner 10 (Advanced, high score)
  {
    id: 16,
    attemptNumber: 1,
    score: 100, // Perfect score
    createdAt: new Date('2024-02-03T18:50:00'),
    attemptedBy: users[22], // Learner 10 - Đinh Thị Kim
    session: sessions[11],
  },

  // Session 13 (Course 8)
  {
    id: 17,
    attemptNumber: 1,
    score: 95,
    createdAt: new Date('2024-02-05T18:55:00'),
    attemptedBy: users[22], // Learner 10
    session: sessions[12],
  },

  // Session 14 (Course 9) - Learner 11
  {
    id: 18,
    attemptNumber: 1,
    score: 80,
    createdAt: new Date('2024-02-04T17:50:00'),
    attemptedBy: users[23], // Learner 11 - Lý Văn Long
    session: sessions[13],
  },

  // Session 15 (Course 10) - Learner 12
  {
    id: 19,
    attemptNumber: 1,
    score: 70,
    createdAt: new Date('2024-02-03T17:55:00'),
    attemptedBy: users[24], // Learner 12 - Cao Thị Minh
    session: sessions[14],
  },

  // Session 16 (Course 11) - Learner 13 (Advanced)
  {
    id: 20,
    attemptNumber: 1,
    score: 90,
    createdAt: new Date('2024-02-03T18:55:00'),
    attemptedBy: users[25], // Learner 13 - Mai Văn Nam
    session: sessions[15],
  },

  // Session 17 (Course 11)
  {
    id: 21,
    attemptNumber: 1,
    score: 95,
    createdAt: new Date('2024-02-05T19:00:00'),
    attemptedBy: users[25], // Learner 13
    session: sessions[16],
  },

  // Session 18 (Course 12) - Learner 14
  {
    id: 22,
    attemptNumber: 1,
    score: 65,
    createdAt: new Date('2024-02-04T18:50:00'),
    attemptedBy: users[26], // Learner 14 - Ngô Thị Nga
    session: sessions[17],
  },

  // More attempts for active learners
  // Learner 10 (Đinh Thị Kim) - Very active, high scores
  {
    id: 23,
    attemptNumber: 1,
    score: 100,
    createdAt: new Date('2024-02-07T19:00:00'),
    attemptedBy: users[22],
    session: sessions[11], // Retaking for practice
  },
  {
    id: 24,
    attemptNumber: 1,
    score: 95,
    createdAt: new Date('2024-02-08T10:30:00'),
    attemptedBy: users[22],
    session: sessions[12],
  },

  // Learner 15 - Đặng Văn Phúc
  {
    id: 25,
    attemptNumber: 1,
    score: 75,
    createdAt: new Date('2024-02-04T18:55:00'),
    attemptedBy: users[27], // Learner 15
    session: sessions[13],
  },
];

// Helper functions
export const getQuizAttemptById = (id: number): QuizAttempt | undefined => {
  return quizAttempts.find((attempt) => attempt.id === id);
};

export const getQuizAttemptsByUser = (userId: number): QuizAttempt[] => {
  return quizAttempts.filter((attempt) => attempt.attemptedBy.id === userId);
};

export const getQuizAttemptsBySession = (sessionId: number): QuizAttempt[] => {
  return quizAttempts.filter((attempt) => attempt.session.id === sessionId);
};

export const getBestAttemptForSession = (
  userId: number,
  sessionId: number,
): QuizAttempt | undefined => {
  const attempts = quizAttempts.filter(
    (attempt) => attempt.attemptedBy.id === userId && attempt.session.id === sessionId,
  );
  return attempts.sort((a, b) => b.score - a.score)[0];
};

export const getAverageScoreByUser = (userId: number): number => {
  const attempts = getQuizAttemptsByUser(userId);
  if (attempts.length === 0) return 0;
  const total = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
  return Math.round(total / attempts.length);
};

export const getUserAttemptCount = (userId: number): number => {
  return getQuizAttemptsByUser(userId).length;
};

export const getPerfectScoreAttempts = (): QuizAttempt[] => {
  return quizAttempts.filter((attempt) => attempt.score === 100);
};

export const getRetakeAttempts = (): QuizAttempt[] => {
  return quizAttempts.filter((attempt) => attempt.attemptNumber > 1);
};
