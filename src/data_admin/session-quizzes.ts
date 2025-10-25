import { SessionQuiz } from '@/types/session-quiz';
import { sessions } from '@/data/sessions';
import { quizzes } from './quizzes';

// Session Quizzes - Liên kết Quiz với Session
// Mỗi session có thể có 1 hoặc nhiều quiz
export const sessionQuizzes: SessionQuiz[] = [
  // Course 1 Sessions - Quiz 1 (Beginner)
  {
    id: 1,
    createdAt: new Date('2024-02-01T10:00:00'),
    session: sessions[0], // Session 1
    quiz: quizzes[0], // Kiến thức cơ bản
  },
  {
    id: 2,
    createdAt: new Date('2024-02-03T10:00:00'),
    session: sessions[1], // Session 2
    quiz: quizzes[1], // Trang bị và sân
  },
  {
    id: 3,
    createdAt: new Date('2024-02-05T10:00:00'),
    session: sessions[2], // Session 3
    quiz: quizzes[2], // Kỹ thuật giao bóng
  },

  // Course 2 Sessions - Quiz 2 (Beginner)
  {
    id: 4,
    createdAt: new Date('2024-02-02T10:00:00'),
    session: sessions[3], // Session 4
    quiz: quizzes[1], // Trang bị
  },
  {
    id: 5,
    createdAt: new Date('2024-02-04T10:00:00'),
    session: sessions[4], // Session 5
    quiz: quizzes[0], // Cơ bản
  },

  // Course 3 Sessions - Quiz 1 (Beginner)
  {
    id: 6,
    createdAt: new Date('2024-02-02T14:00:00'),
    session: sessions[5], // Session 6
    quiz: quizzes[0],
  },

  // Course 4 Sessions - Quiz 3 (Intermediate)
  {
    id: 7,
    createdAt: new Date('2024-02-03T14:00:00'),
    session: sessions[6], // Session 7
    quiz: quizzes[2], // Giao bóng nâng cao
  },

  // Course 5 Sessions - Quiz 1
  {
    id: 8,
    createdAt: new Date('2024-02-02T14:00:00'),
    session: sessions[7], // Session 8
    quiz: quizzes[0],
  },

  // Course 6 Sessions - Quiz 3 (Intermediate)
  {
    id: 9,
    createdAt: new Date('2024-02-03T09:00:00'),
    session: sessions[9], // Session 10
    quiz: quizzes[2],
  },

  // Course 7 Sessions - Quiz 7 (Beginner - Safety)
  {
    id: 10,
    createdAt: new Date('2024-02-02T10:00:00'),
    session: sessions[10], // Session 11
    quiz: quizzes[6], // An toàn
  },

  // Course 8 Sessions - Quiz 5 (Advanced - Spin)
  {
    id: 11,
    createdAt: new Date('2024-02-03T14:00:00'),
    session: sessions[11], // Session 12
    quiz: quizzes[4], // Kỹ thuật spin
  },
  {
    id: 12,
    createdAt: new Date('2024-02-05T14:00:00'),
    session: sessions[12], // Session 13
    quiz: quizzes[4], // Kỹ thuật spin
  },

  // Course 9 Sessions - Quiz 4 (Intermediate - Doubles)
  {
    id: 13,
    createdAt: new Date('2024-02-04T14:00:00'),
    session: sessions[13], // Session 14
    quiz: quizzes[3], // Chiến thuật đôi
  },

  // Course 10 Sessions - Quiz 2
  {
    id: 14,
    createdAt: new Date('2024-02-03T14:00:00'),
    session: sessions[14], // Session 15
    quiz: quizzes[1],
  },

  // Course 11 Sessions - Quiz 6 (Advanced - Strategy)
  {
    id: 15,
    createdAt: new Date('2024-02-03T14:00:00'),
    session: sessions[15], // Session 16
    quiz: quizzes[5], // Chiến thuật chuyên nghiệp
  },
  {
    id: 16,
    createdAt: new Date('2024-02-05T14:00:00'),
    session: sessions[16], // Session 17
    quiz: quizzes[5], // Chiến thuật chuyên nghiệp
  },

  // Course 12 Sessions - Quiz 8 (Intermediate - Movement)
  {
    id: 17,
    createdAt: new Date('2024-02-04T14:00:00'),
    session: sessions[17], // Session 18
    quiz: quizzes[7], // Di chuyển
  },

  // Additional sessions with quizzes
  // Course 1 - Session 4 (if exists)
  {
    id: 18,
    createdAt: new Date('2024-02-07T10:00:00'),
    session: sessions[0], // Can have multiple quizzes per session
    quiz: quizzes[6], // An toàn (additional quiz)
  },

  // Course 8 - Advanced course with more quizzes
  {
    id: 19,
    createdAt: new Date('2024-02-07T14:00:00'),
    session: sessions[11],
    quiz: quizzes[8], // Tâm lý thi đấu
  },

  // Course 11 - Professional level
  {
    id: 20,
    createdAt: new Date('2024-02-07T14:00:00'),
    session: sessions[15],
    quiz: quizzes[8], // Tâm lý
  },
];

// Helper functions
export const getSessionQuizById = (id: number): SessionQuiz | undefined => {
  return sessionQuizzes.find((sq) => sq.id === id);
};

export const getQuizzesBySession = (sessionId: number): SessionQuiz[] => {
  return sessionQuizzes.filter((sq) => sq.session.id === sessionId);
};

export const getSessionsByQuiz = (quizId: number): SessionQuiz[] => {
  return sessionQuizzes.filter((sq) => sq.quiz.id === quizId);
};

export const hasSessionQuiz = (sessionId: number, quizId: number): boolean => {
  return sessionQuizzes.some((sq) => sq.session.id === sessionId && sq.quiz.id === quizId);
};

export const getSessionsWithQuizzes = (): number[] => {
  return [...new Set(sessionQuizzes.map((sq) => sq.session.id))];
};

export const getMostUsedQuiz = (): { quizId: number; count: number } | null => {
  const quizCounts = new Map<number, number>();
  sessionQuizzes.forEach((sq) => {
    quizCounts.set(sq.quiz.id, (quizCounts.get(sq.quiz.id) || 0) + 1);
  });

  let maxQuizId = 0;
  let maxCount = 0;
  quizCounts.forEach((count, quizId) => {
    if (count > maxCount) {
      maxCount = count;
      maxQuizId = quizId;
    }
  });

  return maxCount > 0 ? { quizId: maxQuizId, count: maxCount } : null;
};
