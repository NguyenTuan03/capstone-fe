import { Question } from '@/types/question';
import { quizzes } from './quizzes';

// Questions mock data - Câu hỏi cho từng quiz
export const questions: Question[] = [
  // Quiz 1 - Kiến thức cơ bản (5 questions)
  {
    id: 1,
    title: 'Kích thước sân Pickleball tiêu chuẩn là bao nhiêu?',
    explanation: 'Sân Pickleball có kích thước 13.41m x 6.10m, giống sân cầu lông đôi.',
    quiz: quizzes[0],
  },
  {
    id: 2,
    title: 'Chiều cao lưới ở giữa sân là bao nhiêu?',
    explanation: 'Lưới cao 86cm ở giữa và 91cm ở hai đầu.',
    quiz: quizzes[0],
  },
  {
    id: 3,
    title: 'Bóng Pickleball được làm từ chất liệu gì?',
    explanation: 'Bóng Pickleball làm từ nhựa có nhiều lỗ, tương tự bóng wiffle.',
    quiz: quizzes[0],
  },
  {
    id: 4,
    title: 'Người giao bóng phải đứng ở đâu khi giao?',
    explanation: 'Người giao bóng phải đứng sau baseline, trong khu vực phục vụ.',
    quiz: quizzes[0],
  },
  {
    id: 5,
    title: 'Điểm tối đa của một trận Pickleball thông thường là?',
    explanation: 'Thường chơi đến 11 điểm, thắng phải hơn ít nhất 2 điểm.',
    quiz: quizzes[0],
  },

  // Quiz 2 - Trang bị và sân (4 questions)
  {
    id: 6,
    title: 'Vợt Pickleball không được làm từ chất liệu nào?',
    explanation: 'Vợt có thể làm từ gỗ, composite hoặc graphite.',
    quiz: quizzes[1],
  },
  {
    id: 7,
    title: 'Khu vực "Kitchen" (Non-Volley Zone) cách lưới bao xa?',
    explanation: 'Kitchen cách lưới 2.13m về mỗi phía.',
    quiz: quizzes[1],
  },
  {
    id: 8,
    title: 'Giày chơi Pickleball nên có đặc điểm gì?',
    explanation: 'Giày nên có đế chống trượt và hỗ trợ di chuyển nhanh.',
    quiz: quizzes[1],
  },
  {
    id: 9,
    title: 'Màu sắc trang phục có quy định đặc biệt không?',
    explanation: 'Không có quy định nghiêm ngặt, nhưng thi đấu chuyên nghiệp có dresscode.',
    quiz: quizzes[1],
  },

  // Quiz 3 - Kỹ thuật giao bóng (5 questions)
  {
    id: 10,
    title: 'Giao bóng underhand là gì?',
    explanation: 'Giao bóng từ dưới lên, tay không được cao quá eo.',
    quiz: quizzes[2],
  },
  {
    id: 11,
    title: 'Bóng giao phải chạm sân đối phương ở đâu?',
    explanation: 'Phải rơi vào ô chéo đối diện, không được vào Kitchen.',
    quiz: quizzes[2],
  },
  {
    id: 12,
    title: 'Khi nào được giao bóng lần hai?',
    explanation: 'Trong trận đôi, mỗi đội có 2 lượt giao (trừ lượt đầu tiên).',
    quiz: quizzes[2],
  },
  {
    id: 13,
    title: 'Giao bóng topspin có ưu điểm gì?',
    explanation: 'Bóng nảy cao và nhanh hơn, khó kiểm soát với đối thủ.',
    quiz: quizzes[2],
  },
  {
    id: 14,
    title: 'Lỗi giao bóng phổ biến nhất là gì?',
    explanation: 'Giao vào lưới hoặc ra ngoài là lỗi phổ biến nhất.',
    quiz: quizzes[2],
  },

  // Quiz 4 - Chiến thuật đôi (5 questions)
  {
    id: 15,
    title: 'Vị trí "stacking" trong pickleball đôi là gì?',
    explanation: 'Cách sắp xếp vị trí để người chơi thuận tay luôn ở giữa.',
    quiz: quizzes[3],
  },
  {
    id: 16,
    title: 'Khi đồng đội ở lưới, bạn nên ở đâu?',
    explanation: 'Nên tiến lên lưới cùng đồng đội để có lợi thế.',
    quiz: quizzes[3],
  },
  {
    id: 17,
    title: 'Ai nên bắt bóng ở giữa trong trận đôi?',
    explanation: 'Người thuận tay forehand nên bắt bóng giữa.',
    quiz: quizzes[3],
  },
  {
    id: 18,
    title: 'Chiến thuật "dinking" là gì?',
    explanation: 'Đánh bóng nhẹ qua lại ở gần lưới để tìm cơ hội tấn công.',
    quiz: quizzes[3],
  },
  {
    id: 19,
    title: 'Khi nào nên sử dụng "lob shot"?',
    explanation: 'Khi đối thủ tiến quá gần lưới, đánh bóng cao qua đầu họ.',
    quiz: quizzes[3],
  },

  // Quiz 5 - Kỹ thuật spin (6 questions)
  {
    id: 20,
    title: 'Topspin giúp bóng như thế nào?',
    explanation: 'Bóng quay về phía trước, nảy cao và nhanh hơn.',
    quiz: quizzes[4],
  },
  {
    id: 21,
    title: 'Backspin có tác dụng gì?',
    explanation: 'Bóng quay ngược, nảy thấp và chậm lại sau khi chạm sân.',
    quiz: quizzes[4],
  },
  {
    id: 22,
    title: 'Sidespin thường dùng khi nào?',
    explanation: 'Dùng để làm bóng lệch hướng, khó dự đoán.',
    quiz: quizzes[4],
  },
  {
    id: 23,
    title: 'Làm thế nào để tạo topspin mạnh?',
    explanation: 'Đánh từ dưới lên trên với chuyển động cổ tay nhanh.',
    quiz: quizzes[4],
  },
  {
    id: 24,
    title: 'Vợt nào tốt nhất cho spin?',
    explanation: 'Vợt có bề mặt nhám giúp tạo spin tốt hơn.',
    quiz: quizzes[4],
  },
  {
    id: 25,
    title: 'Khi nhận bóng spin, nên làm gì?',
    explanation: 'Dự đoán hướng quay và điều chỉnh góc vợt phù hợp.',
    quiz: quizzes[4],
  },

  // Quiz 6 - Chiến thuật chuyên nghiệp (5 questions)
  {
    id: 26,
    title: 'Trong tình huống áp lực, nên ưu tiên gì?',
    explanation: 'Giữ bóng trong sân và chờ đối thủ mắc lỗi.',
    quiz: quizzes[5],
  },
  {
    id: 27,
    title: 'Khi nào nên thay đổi nhịp độ chơi?',
    explanation: 'Khi chiến thuật hiện tại không hiệu quả hoặc đối thủ quen.',
    quiz: quizzes[5],
  },
  {
    id: 28,
    title: 'Điểm yếu phổ biến nhất của đối thủ là?',
    explanation: 'Backhand thường là điểm yếu của nhiều người.',
    quiz: quizzes[5],
  },
  {
    id: 29,
    title: 'Chiến thuật "Erne" là gì?',
    explanation: 'Nhảy từ ngoài sân vào đánh bóng bên cạnh Kitchen.',
    quiz: quizzes[5],
  },
  {
    id: 30,
    title: 'Khi dẫn trước nhiều, nên làm gì?',
    explanation: 'Tiếp tục chơi theo kế hoạch, không chủ quan.',
    quiz: quizzes[5],
  },

  // Quiz 7 - An toàn (4 questions)
  {
    id: 31,
    title: 'Nên khởi động bao lâu trước khi chơi?',
    explanation: 'Ít nhất 10-15 phút để cơ thể sẵn sàng.',
    quiz: quizzes[6],
  },
  {
    id: 32,
    title: 'Chấn thương phổ biến nhất trong Pickleball?',
    explanation: 'Viêm khuỷu tay (tennis elbow) và bong gân cổ chân.',
    quiz: quizzes[6],
  },
  {
    id: 33,
    title: 'Khi nào nên nghỉ ngơi?',
    explanation: 'Khi cảm thấy đau hoặc mệt quá mức.',
    quiz: quizzes[6],
  },
  {
    id: 34,
    title: 'Trang bị bảo vệ nào quan trọng?',
    explanation: 'Kính bảo vệ mắt và giày có đế tốt.',
    quiz: quizzes[6],
  },

  // Quiz 8 - Di chuyển (5 questions)
  {
    id: 35,
    title: 'Tư thế sẵn sàng đúng là như thế nào?',
    explanation: 'Chân mở rộng, đầu gối hơi cúi, trọng tâm ở giữa.',
    quiz: quizzes[7],
  },
  {
    id: 36,
    title: 'Kỹ thuật "split step" là gì?',
    explanation: 'Nhảy nhẹ khi đối thủ chạm bóng để sẵn sàng di chuyển.',
    quiz: quizzes[7],
  },
  {
    id: 37,
    title: 'Khi di chuyển lùi, nên làm gì?',
    explanation: 'Di chuyển theo đường chéo và giữ mặt nhìn bóng.',
    quiz: quizzes[7],
  },
  {
    id: 38,
    title: 'Bước chân nào quan trọng nhất?',
    explanation: 'Bước đầu tiên quyết định tốc độ phản ứng.',
    quiz: quizzes[7],
  },
  {
    id: 39,
    title: 'Làm thế nào để di chuyển hiệu quả?',
    explanation: 'Di chuyển nhỏ, nhanh và giữ cân bằng.',
    quiz: quizzes[7],
  },

  // Quiz 9 - Tâm lý (5 questions)
  {
    id: 40,
    title: 'Khi mắc lỗi, nên làm gì?',
    explanation: 'Chấp nhận và tập trung vào điểm tiếp theo.',
    quiz: quizzes[8],
  },
  {
    id: 41,
    title: 'Cách kiểm soát cảm xúc tốt nhất?',
    explanation: 'Hít thở sâu và tập trung vào quy trình, không vào kết quả.',
    quiz: quizzes[8],
  },
  {
    id: 42,
    title: 'Khi đối thủ chơi tốt, nên nghĩ gì?',
    explanation: 'Tôn trọng và tìm cách điều chỉnh chiến thuật.',
    quiz: quizzes[8],
  },
  {
    id: 43,
    title: 'Áp lực thi đấu đến từ đâu?',
    explanation: 'Từ kỳ vọng của bản thân và lo sợ thất bại.',
    quiz: quizzes[8],
  },
  {
    id: 44,
    title: 'Tư duy tích cực giúp gì?',
    explanation: 'Tăng sự tự tin và khả năng phục hồi sau sai lầm.',
    quiz: quizzes[8],
  },

  // Quiz 10 - Điểm số và luật (5 questions)
  {
    id: 45,
    title: 'Chỉ đội nào được ghi điểm?',
    explanation: 'Chỉ đội đang giao bóng mới được ghi điểm.',
    quiz: quizzes[9],
  },
  {
    id: 46,
    title: 'Cách đọc tỷ số trong Pickleball?',
    explanation: 'Điểm của người giao - điểm đối thủ - số lượt giao.',
    quiz: quizzes[9],
  },
  {
    id: 47,
    title: 'Khi nào xảy ra "side out"?',
    explanation: 'Khi đội giao bóng mất quyền giao.',
    quiz: quizzes[9],
  },
  {
    id: 48,
    title: 'Có được đập bóng trong Kitchen không?',
    explanation: 'Không được, trừ khi bóng đã nảy trong Kitchen.',
    quiz: quizzes[9],
  },
  {
    id: 49,
    title: 'Luật "double bounce" là gì?',
    explanation: 'Bóng giao và bóng trả phải nảy sân trước khi đánh.',
    quiz: quizzes[9],
  },
];

// Helper functions
export const getQuestionById = (id: number): Question | undefined => {
  return questions.find((q) => q.id === id);
};

export const getQuestionsByQuiz = (quizId: number): Question[] => {
  return questions.filter((q) => q.quiz.id === quizId);
};

export const getQuestionCount = (quizId: number): number => {
  return getQuestionsByQuiz(quizId).length;
};

