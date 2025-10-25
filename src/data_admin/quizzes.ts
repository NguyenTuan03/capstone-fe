import { Quiz } from '@/types/quiz';
import { PickleballLevel } from '@/types/enums';
import { users } from './users';

// Quizzes mock data
// Được tạo bởi coaches (user ids 2-13)
export const quizzes: Quiz[] = [
  // Quiz 1 - Beginner level by Coach 1 (Phạm Văn Hùng)
  {
    id: 1,
    title: 'Kiến thức cơ bản về Pickleball',
    description: 'Quiz về luật chơi và kỹ thuật cơ bản',
    level: PickleballLevel.BEGINNER,
    totalQuestions: 5,
    createdBy: users[1],
  },
  
  // Quiz 2 - Beginner by Coach 2 (Lê Thị Mai)
  {
    id: 2,
    title: 'Trang bị và sân Pickleball',
    description: 'Hiểu biết về trang bị và quy chuẩn sân',
    level: PickleballLevel.BEGINNER,
    totalQuestions: 4,
    createdBy: users[2],
  },

  // Quiz 3 - Intermediate by Coach 3 (Trần Văn Nam)
  {
    id: 3,
    title: 'Kỹ thuật giao bóng nâng cao',
    description: 'Các loại giao bóng và chiến thuật',
    level: PickleballLevel.INTERMEDIATE,
    totalQuestions: 5,
    createdBy: users[3],
  },

  // Quiz 4 - Intermediate by Coach 4 (Nguyễn Thị Oanh)
  {
    id: 4,
    title: 'Chiến thuật đôi trong Pickleball',
    description: 'Phối hợp và di chuyển trong trận đấu đôi',
    level: PickleballLevel.INTERMEDIATE,
    totalQuestions: 5,
    createdBy: users[4],
  },

  // Quiz 5 - Advanced by Coach 5 (Hoàng Văn Phú)
  {
    id: 5,
    title: 'Kỹ thuật spin và kiểm soát bóng',
    description: 'Làm chủ các loại spin và hiệu ứng bóng',
    level: PickleballLevel.ADVANCED,
    totalQuestions: 6,
    createdBy: users[5],
  },

  // Quiz 6 - Advanced by Coach 6 (Đặng Thị Quỳnh)
  {
    id: 6,
    title: 'Chiến thuật thi đấu chuyên nghiệp',
    description: 'Phân tích tình huống và ra quyết định',
    level: PickleballLevel.ADVANCED,
    totalQuestions: 5,
    createdBy: users[6],
  },

  // Quiz 7 - Beginner by Coach 7 (Vũ Văn Sơn)
  {
    id: 7,
    title: 'An toàn khi chơi Pickleball',
    description: 'Khởi động và phòng tránh chấn thương',
    level: PickleballLevel.BEGINNER,
    totalQuestions: 4,
    createdBy: users[7],
  },

  // Quiz 8 - Intermediate by Coach 8 (Bùi Thị Tâm)
  {
    id: 8,
    title: 'Kỹ năng di chuyển và bước chân',
    description: 'Tối ưu hóa di chuyển trên sân',
    level: PickleballLevel.INTERMEDIATE,
    totalQuestions: 5,
    createdBy: users[8],
  },

  // Quiz 9 - Advanced by Coach 9 (Lý Văn Tùng)
  {
    id: 9,
    title: 'Tâm lý thi đấu',
    description: 'Kiểm soát cảm xúc và tập trung',
    level: PickleballLevel.ADVANCED,
    totalQuestions: 5,
    createdBy: users[9],
  },

  // Quiz 10 - Beginner by Coach 10 (Cao Thị Uyên)
  {
    id: 10,
    title: 'Điểm số và luật cơ bản',
    description: 'Cách tính điểm và các quy tắc',
    level: PickleballLevel.BEGINNER,
    totalQuestions: 5,
    createdBy: users[10],
  },
];

// Helper functions
export const getQuizById = (id: number): Quiz | undefined => {
  return quizzes.find((quiz) => quiz.id === id);
};

export const getQuizzesByLevel = (level: PickleballLevel): Quiz[] => {
  return quizzes.filter((quiz) => quiz.level === level);
};

export const getQuizzesByCoach = (coachUserId: number): Quiz[] => {
  return quizzes.filter((quiz) => quiz.createdBy.id === coachUserId);
};

export const getBeginnerQuizzes = (): Quiz[] => {
  return getQuizzesByLevel(PickleballLevel.BEGINNER);
};

export const getIntermediateQuizzes = (): Quiz[] => {
  return getQuizzesByLevel(PickleballLevel.INTERMEDIATE);
};

export const getAdvancedQuizzes = (): Quiz[] => {
  return getQuizzesByLevel(PickleballLevel.ADVANCED);
};

