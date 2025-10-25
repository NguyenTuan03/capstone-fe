import { Quiz } from '@/types/quiz';
import { Question } from '@/types/question';
import { QuestionOption } from '@/types/question-option';
import { PickleballLevel } from '@/types/enums';
import { users } from './users';

// We'll create questions and options inline for simplicity
// In a real app, these would be separate tables

interface QuizWithQuestionsAndOptions extends Quiz {
  questionsData: Array<{
    question: Question;
    options: QuestionOption[];
  }>;
}

// 18 quizzes - các coaches tạo quiz cho courses của mình
export const quizzesData: QuizWithQuestionsAndOptions[] = [
  // Quiz 1 - For Course 1 (Pickleball Cơ Bản) - Coach 1
  {
    id: 1,
    title: 'Kiểm Tra Kiến Thức Cơ Bản',
    description: 'Bài kiểm tra kiến thức cơ bản về pickleball',
    level: PickleballLevel.BEGINNER,
    totalQuestions: 5,
    createdBy: users[1],
    questionsData: [
      {
        question: {
          id: 1,
          title: 'Kích thước sân pickleball chuẩn là bao nhiêu?',
          explanation: 'Sân pickleball có kích thước 20 x 44 feet (6.1 x 13.4m)',
          quiz: {} as Quiz,
        },
        options: [
          { id: 1, content: '20 x 44 feet', isCorrect: true, question: {} as Question },
          { id: 2, content: '30 x 60 feet', isCorrect: false, question: {} as Question },
          { id: 3, content: '25 x 50 feet', isCorrect: false, question: {} as Question },
          { id: 4, content: '15 x 40 feet', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 2,
          title: 'Kitchen zone (vùng cấm) có chiều rộng bao nhiêu?',
          explanation: 'Kitchen zone rộng 7 feet từ lưới',
          quiz: {} as Quiz,
        },
        options: [
          { id: 5, content: '5 feet', isCorrect: false, question: {} as Question },
          { id: 6, content: '7 feet', isCorrect: true, question: {} as Question },
          { id: 7, content: '10 feet', isCorrect: false, question: {} as Question },
          { id: 8, content: '8 feet', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 3,
          title: 'Serve trong pickleball phải được thực hiện như thế nào?',
          explanation: 'Serve phải được thực hiện underhand (từ dưới lên)',
          quiz: {} as Quiz,
        },
        options: [
          { id: 9, content: 'Overhand (từ trên xuống)', isCorrect: false, question: {} as Question },
          { id: 10, content: 'Underhand (từ dưới lên)', isCorrect: true, question: {} as Question },
          { id: 11, content: 'Sidearm (từ bên hông)', isCorrect: false, question: {} as Question },
          { id: 12, content: 'Tùy ý', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 4,
          title: 'Một trận pickleball thông thường chơi đến bao nhiêu điểm?',
          explanation: 'Trận đấu thường chơi đến 11 điểm, phải thắng cách biệt 2 điểm',
          quiz: {} as Quiz,
        },
        options: [
          { id: 13, content: '15 điểm', isCorrect: false, question: {} as Question },
          { id: 14, content: '11 điểm', isCorrect: true, question: {} as Question },
          { id: 15, content: '21 điểm', isCorrect: false, question: {} as Question },
          { id: 16, content: '25 điểm', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 5,
          title: 'Two-bounce rule là gì?',
          explanation: 'Bóng phải bounce 1 lần ở mỗi bên sau serve trước khi có thể volley',
          quiz: {} as Quiz,
        },
        options: [
          { id: 17, content: 'Bóng phải bounce 2 lần trước khi đánh', isCorrect: false, question: {} as Question },
          { id: 18, content: 'Mỗi bên phải để bóng bounce 1 lần sau serve', isCorrect: true, question: {} as Question },
          { id: 19, content: 'Không được để bóng bounce', isCorrect: false, question: {} as Question },
          { id: 20, content: 'Chỉ áp dụng khi serve', isCorrect: false, question: {} as Question },
        ],
      },
    ],
  },

  // Quiz 2 - For Course 2 (Chiến Thuật Nâng Cao) - Coach 1
  {
    id: 2,
    title: 'Chiến Thuật Nâng Cao',
    description: 'Kiểm tra hiểu biết về chiến thuật nâng cao',
    level: PickleballLevel.ADVANCED,
    totalQuestions: 6,
    createdBy: users[1],
    questionsData: [
      {
        question: {
          id: 6,
          title: 'Trong tình huống nào nên sử dụng lob shot?',
          explanation: 'Lob shot hiệu quả khi đối thủ đứng gần lưới',
          quiz: {} as Quiz,
        },
        options: [
          { id: 21, content: 'Khi đối thủ ở gần baseline', isCorrect: false, question: {} as Question },
          { id: 22, content: 'Khi đối thủ đứng gần lưới', isCorrect: true, question: {} as Question },
          { id: 23, content: 'Khi đang serve', isCorrect: false, question: {} as Question },
          { id: 24, content: 'Khi trong kitchen zone', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 7,
          title: 'Stacking trong doubles là gì?',
          explanation: 'Stacking là chiến thuật xếp 2 người về 1 phía để tối ưu forehand',
          quiz: {} as Quiz,
        },
        options: [
          { id: 25, content: 'Đứng chồng lên nhau', isCorrect: false, question: {} as Question },
          { id: 26, content: 'Xếp 2 người về 1 phía sân', isCorrect: true, question: {} as Question },
          { id: 27, content: 'Đánh nhiều lần liên tiếp', isCorrect: false, question: {} as Question },
          { id: 28, content: 'Một người đứng trước, một người sau', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 8,
          title: 'Third shot drop có mục đích gì?',
          explanation: 'Third shot drop giúp team tiến lên kitchen line an toàn',
          quiz: {} as Quiz,
        },
        options: [
          { id: 29, content: 'Ghi điểm ngay lập tức', isCorrect: false, question: {} as Question },
          { id: 30, content: 'Tiến lên kitchen line an toàn', isCorrect: true, question: {} as Question },
          { id: 31, content: 'Làm đối thủ mất tập trung', isCorrect: false, question: {} as Question },
          { id: 32, content: 'Thể hiện kỹ năng', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 9,
          title: 'Khi nào nên dink cross-court?',
          explanation: 'Dink cross-court an toàn hơn vì khoảng cách dài hơn và tránh middle',
          quiz: {} as Quiz,
        },
        options: [
          { id: 33, content: 'Khi muốn kết thúc rally nhanh', isCorrect: false, question: {} as Question },
          { id: 34, content: 'Khi cần thời gian hoặc tạo góc', isCorrect: true, question: {} as Question },
          { id: 35, content: 'Khi đối thủ đứng gần lưới', isCorrect: false, question: {} as Question },
          { id: 36, content: 'Không bao giờ nên dink cross-court', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 10,
          title: 'Reset shot được dùng khi nào?',
          explanation: 'Reset shot dùng để chuyển từ thế phòng thủ về trung lập',
          quiz: {} as Quiz,
        },
        options: [
          { id: 37, content: 'Khi muốn tấn công', isCorrect: false, question: {} as Question },
          { id: 38, content: 'Khi bị tấn công và cần neutralize', isCorrect: true, question: {} as Question },
          { id: 39, content: 'Khi serve', isCorrect: false, question: {} as Question },
          { id: 40, content: 'Khi đối thủ mắc lỗi', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 11,
          title: 'Targeting trong doubles nên nhắm vào đâu?',
          explanation: 'Nhắm vào middle (giữa 2 người) thường gây confusion',
          quiz: {} as Quiz,
        },
        options: [
          { id: 41, content: 'Luôn đánh về người yếu hơn', isCorrect: false, question: {} as Question },
          { id: 42, content: 'Middle (giữa 2 người)', isCorrect: true, question: {} as Question },
          { id: 43, content: 'Luôn đánh cross-court', isCorrect: false, question: {} as Question },
          { id: 44, content: 'Vào góc sân xa nhất', isCorrect: false, question: {} as Question },
        ],
      },
    ],
  },

  // Quiz 3 - For Course 3 (Kỹ Thuật Thi Đấu Đôi) - Coach 2
  {
    id: 3,
    title: 'Kiến Thức Thi Đấu Đôi',
    description: 'Bài test về kỹ thuật và chiến thuật đôi',
    level: PickleballLevel.INTERMEDIATE,
    totalQuestions: 5,
    createdBy: users[2],
    questionsData: [
      {
        question: {
          id: 12,
          title: 'Trong doubles, vị trí tốt nhất để đứng là?',
          explanation: 'Kitchen line là vị trí mạnh nhất trong doubles',
          quiz: {} as Quiz,
        },
        options: [
          { id: 45, content: 'Baseline', isCorrect: false, question: {} as Question },
          { id: 46, content: 'Kitchen line', isCorrect: true, question: {} as Question },
          { id: 47, content: 'Mid-court', isCorrect: false, question: {} as Question },
          { id: 48, content: 'Tùy tình huống', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 13,
          title: 'Poaching trong doubles là gì?',
          explanation: 'Poaching là khi người không phải target đánh bóng của partner',
          quiz: {} as Quiz,
        },
        options: [
          { id: 49, content: 'Đánh bóng của đối thủ', isCorrect: false, question: {} as Question },
          { id: 50, content: 'Đánh bóng dành cho partner', isCorrect: true, question: {} as Question },
          { id: 51, content: 'Đánh serve của đối thủ', isCorrect: false, question: {} as Question },
          { id: 52, content: 'Đứng chắn partner', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 14,
          title: 'Partner communication quan trọng nhất khi nào?',
          explanation: 'Communication quan trọng nhất tại middle balls',
          quiz: {} as Quiz,
        },
        options: [
          { id: 53, content: 'Khi serve', isCorrect: false, question: {} as Question },
          { id: 54, content: 'Khi bóng bay vào middle', isCorrect: true, question: {} as Question },
          { id: 55, content: 'Sau mỗi điểm', isCorrect: false, question: {} as Question },
          { id: 56, content: 'Khi đối thủ lob', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 15,
          title: 'Switching sides trong doubles thường xảy ra khi nào?',
          explanation: 'Switch khi có lob và một người phải lùi về lấy bóng',
          quiz: {} as Quiz,
        },
        options: [
          { id: 57, content: 'Sau mỗi game', isCorrect: false, question: {} as Question },
          { id: 58, content: 'Khi có lob shot', isCorrect: true, question: {} as Question },
          { id: 59, content: 'Khi mất điểm', isCorrect: false, question: {} as Question },
          { id: 60, content: 'Không bao giờ switch', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 16,
          title: 'Trong doubles, ai nên cover the middle?',
          explanation: 'Người có forehand tại middle nên cover',
          quiz: {} as Quiz,
        },
        options: [
          { id: 61, content: 'Người cao hơn', isCorrect: false, question: {} as Question },
          { id: 62, content: 'Người có forehand ở middle', isCorrect: true, question: {} as Question },
          { id: 63, content: 'Người đứng bên trái', isCorrect: false, question: {} as Question },
          { id: 64, content: 'Người gần hơn', isCorrect: false, question: {} as Question },
        ],
      },
    ],
  },

  // Quiz 4 - For Course 7 (Phòng Ngừa Chấn Thương) - Coach 5
  {
    id: 4,
    title: 'An Toàn và Phòng Chấn Thương',
    description: 'Kiến thức về an toàn và phòng ngừa chấn thương',
    level: PickleballLevel.INTERMEDIATE,
    totalQuestions: 5,
    createdBy: users[5],
    questionsData: [
      {
        question: {
          id: 17,
          title: 'Thời gian khởi động tối thiểu trước khi chơi là?',
          explanation: '5-10 phút khởi động giúp giảm nguy cơ chấn thương',
          quiz: {} as Quiz,
        },
        options: [
          { id: 65, content: '2-3 phút', isCorrect: false, question: {} as Question },
          { id: 66, content: '5-10 phút', isCorrect: true, question: {} as Question },
          { id: 67, content: '15-20 phút', isCorrect: false, question: {} as Question },
          { id: 68, content: 'Không cần khởi động', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 18,
          title: 'Vùng cơ thể dễ bị chấn thương nhất trong pickleball?',
          explanation: 'Vai và cùi chỏ dễ bị chấn thương do động tác lặp đi lặp lại',
          quiz: {} as Quiz },
        options: [
          { id: 69, content: 'Đầu gối', isCorrect: false, question: {} as Question },
          { id: 70, content: 'Vai và cùi chỏ', isCorrect: true, question: {} as Question },
          { id: 71, content: 'Cổ tay', isCorrect: false, question: {} as Question },
          { id: 72, content: 'Lưng', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 19,
          title: 'Khi nào nên nghỉ ngơi trong quá trình chơi?',
          explanation: 'Nên nghỉ khi cảm thấy đau hoặc mệt quá mức',
          quiz: {} as Quiz,
        },
        options: [
          { id: 73, content: 'Sau mỗi game', isCorrect: false, question: {} as Question },
          { id: 74, content: 'Khi cảm thấy đau hoặc mệt', isCorrect: true, question: {} as Question },
          { id: 75, content: 'Sau 1 giờ chơi', isCorrect: false, question: {} as Question },
          { id: 76, content: 'Không cần nghỉ', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 20,
          title: 'Hydration quan trọng như thế nào?',
          explanation: 'Nên uống nước trước, trong và sau khi chơi',
          quiz: {} as Quiz,
        },
        options: [
          { id: 77, content: 'Chỉ uống khi khát', isCorrect: false, question: {} as Question },
          { id: 78, content: 'Uống trước, trong và sau chơi', isCorrect: true, question: {} as Question },
          { id: 79, content: 'Chỉ uống sau khi chơi', isCorrect: false, question: {} as Question },
          { id: 80, content: 'Không quan trọng', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 21,
          title: 'Stretching nên thực hiện khi nào?',
          explanation: 'Dynamic stretching trước, static stretching sau khi chơi',
          quiz: {} as Quiz,
        },
        options: [
          { id: 81, content: 'Chỉ trước khi chơi', isCorrect: false, question: {} as Question },
          { id: 82, content: 'Cả trước và sau khi chơi', isCorrect: true, question: {} as Question },
          { id: 83, content: 'Chỉ sau khi chơi', isCorrect: false, question: {} as Question },
          { id: 84, content: 'Không cần stretching', isCorrect: false, question: {} as Question },
        ],
      },
    ],
  },

  // Continue with more quizzes... (I'll create a few more representative ones)
  // Quiz 5 - For Course 11 (Trẻ Em) - Coach 7
  {
    id: 5,
    title: 'Pickleball Cho Trẻ Em - Cơ Bản',
    description: 'Kiến thức cơ bản dành cho trẻ em',
    level: PickleballLevel.BEGINNER,
    totalQuestions: 5,
    createdBy: users[7],
    questionsData: [
      {
        question: {
          id: 22,
          title: 'Pickleball được chơi bằng gì?',
          explanation: 'Pickleball sử dụng paddle và plastic ball có lỗ',
          quiz: {} as Quiz,
        },
        options: [
          { id: 85, content: 'Vợt tennis và bóng tennis', isCorrect: false, question: {} as Question },
          { id: 86, content: 'Paddle và bóng nhựa có lỗ', isCorrect: true, question: {} as Question },
          { id: 87, content: 'Vợt cầu lông và quả cầu', isCorrect: false, question: {} as Question },
          { id: 88, content: 'Tay không', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 23,
          title: 'Kitchen zone là vùng gì?',
          explanation: 'Kitchen là vùng gần lưới nơi không được volley',
          quiz: {} as Quiz,
        },
        options: [
          { id: 89, content: 'Nơi ăn uống nghỉ ngơi', isCorrect: false, question: {} as Question },
          { id: 90, content: 'Vùng cấm gần lưới', isCorrect: true, question: {} as Question },
          { id: 91, content: 'Nơi serve', isCorrect: false, question: {} as Question },
          { id: 92, content: 'Toàn bộ sân', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 24,
          title: 'Khi chơi, điều quan trọng nhất là gì?',
          explanation: 'An toàn và vui vẻ là quan trọng nhất',
          quiz: {} as Quiz,
        },
        options: [
          { id: 93, content: 'Thắng mọi trận', isCorrect: false, question: {} as Question },
          { id: 94, content: 'An toàn và vui vẻ', isCorrect: true, question: {} as Question },
          { id: 95, content: 'Đánh mạnh nhất có thể', isCorrect: false, question: {} as Question },
          { id: 96, content: 'Chơi nhanh nhất có thể', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 25,
          title: 'Khi serve, bóng phải rơi vào đâu?',
          explanation: 'Serve phải rơi vào service box đối diện chéo',
          quiz: {} as Quiz,
        },
        options: [
          { id: 97, content: 'Bất kỳ đâu trên sân', isCorrect: false, question: {} as Question },
          { id: 98, content: 'Service box đối diện chéo', isCorrect: true, question: {} as Question },
          { id: 99, content: 'Vào kitchen', isCorrect: false, question: {} as Question },
          { id: 100, content: 'Gần lưới', isCorrect: false, question: {} as Question },
        ],
      },
      {
        question: {
          id: 26,
          title: 'Nên làm gì khi bạn mắc lỗi?',
          explanation: 'Hãy cười và thử lại, mọi người đều mắc lỗi',
          quiz: {} as Quiz,
        },
        options: [
          { id: 101, content: 'Khóc và bỏ về', isCorrect: false, question: {} as Question },
          { id: 102, content: 'Cười và thử lại', isCorrect: true, question: {} as Question },
          { id: 103, content: 'Đổ lỗi cho người khác', isCorrect: false, question: {} as Question },
          { id: 104, content: 'Giận dữ', isCorrect: false, question: {} as Question },
        ],
      },
    ],
  },
];

// Export simplified quizzes array without nested data
export const quizzes: Quiz[] = quizzesData.map((q) => ({
  id: q.id,
  title: q.title,
  description: q.description,
  level: q.level,
  totalQuestions: q.totalQuestions,
  createdBy: q.createdBy,
}));

// Export all questions
export const questions: Question[] = quizzesData.flatMap((quiz, quizIndex) =>
  quiz.questionsData.map((qData) => ({
    ...qData.question,
    quiz: quizzes[quizIndex],
  })),
);

// Export all question options
export const questionOptions: QuestionOption[] = quizzesData.flatMap((quiz) =>
  quiz.questionsData.flatMap((qData, qIndex) =>
    qData.options.map((option) => ({
      ...option,
      question: questions.find((q) => q.id === qData.question.id)!,
    })),
  ),
);

// Helper functions
export const getQuizById = (id: number): Quiz | undefined => {
  return quizzes.find((quiz) => quiz.id === id);
};

export const getQuizzesByCoachUserId = (userId: number): Quiz[] => {
  return quizzes.filter((quiz) => quiz.createdBy.id === userId);
};

export const getQuizzesByLevel = (level: PickleballLevel): Quiz[] => {
  return quizzes.filter((quiz) => quiz.level === level);
};

export const getQuestionsByQuizId = (quizId: number): Question[] => {
  return questions.filter((q) => q.quiz.id === quizId);
};

export const getOptionsByQuestionId = (questionId: number): QuestionOption[] => {
  return questionOptions.filter((opt) => opt.question.id === questionId);
};

export const getCorrectOption = (questionId: number): QuestionOption | undefined => {
  return questionOptions.find(
    (opt) => opt.question.id === questionId && opt.isCorrect,
  );
};


