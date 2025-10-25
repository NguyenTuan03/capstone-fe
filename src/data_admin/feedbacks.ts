import { Feedback } from '@/types/feedback';
import { courses } from './courses';
import { users } from './users';

// Feedbacks - Only for COMPLETED or ONGOING courses with CONFIRMED enrollments
// Rating: 1-5 stars
export const feedbacks: Feedback[] = [
  // Course 1 (Pickleball Cơ Bản - APPROVED/Future) - 5 feedbacks
  {
    id: 1,
    comment:
      'Khóa học rất tốt cho người mới bắt đầu! Huấn luyện viên nhiệt tình, giải thích rõ ràng.',
    rating: 5,
    createdAt: new Date('2024-01-20'),
    createdBy: users[13], // Learner 1 - Nguyễn Văn An
    course: courses[0],
  },
  {
    id: 2,
    comment:
      'Mình học được rất nhiều kỹ thuật cơ bản. Cô giáo dạy rất tận tâm.',
    rating: 5,
    createdAt: new Date('2024-01-21'),
    createdBy: users[14], // Learner 2 - Trần Thị Bình
    course: courses[0],
  },
  {
    id: 3,
    comment:
      'Khóa học hay, nhưng thời gian hơi ngắn. Mong có thêm nhiều buổi học thực hành hơn.',
    rating: 4,
    createdAt: new Date('2024-01-22'),
    createdBy: users[16], // Learner 4 - Phạm Thị Diệp
    course: courses[0],
  },
  {
    id: 4,
    comment:
      'Rất hài lòng với khóa học. Đã tiến bộ rõ rệt sau vài buổi học.',
    rating: 5,
    createdAt: new Date('2024-01-23'),
    createdBy: users[23], // Learner 11 - Lý Văn Long
    course: courses[0],
  },
  {
    id: 5,
    comment: 'Khóa học tốt, phù hợp với người mới bắt đầu như mình.',
    rating: 4,
    createdAt: new Date('2024-01-24'),
    createdBy: users[24], // Learner 12 - Cao Thị Minh
    course: courses[0],
  },

  // Course 2 (Chiến Thuật Nâng Cao - ONGOING) - 1 feedback
  {
    id: 6,
    comment:
      'Khóa học chuyên sâu và chất lượng cao. Huấn luyện viên có kinh nghiệm thực chiến.',
    rating: 5,
    createdAt: new Date('2024-01-18'),
    createdBy: users[22], // Learner 10 - Đinh Thị Kim
    course: courses[1],
  },

  // Course 3 (Kỹ Thuật Thi Đấu Đôi) - 4 feedbacks
  {
    id: 7,
    comment:
      'Học được nhiều chiến thuật phối hợp trong thi đấu đôi. Rất bổ ích!',
    rating: 5,
    createdAt: new Date('2024-01-24'),
    createdBy: users[15], // Learner 3 - Lê Văn Cảnh
    course: courses[2],
  },
  {
    id: 8,
    comment:
      'Cô giáo dạy rất dễ hiểu, giúp mình cải thiện kỹ năng giao tiếp với đồng đội.',
    rating: 5,
    createdAt: new Date('2024-01-25'),
    createdBy: users[17], // Learner 5 - Hoàng Văn Em
    course: courses[2],
  },
  {
    id: 9,
    comment: 'Khóa học hay nhưng cần thêm thời gian thực hành.',
    rating: 4,
    createdAt: new Date('2024-01-25'),
    createdBy: users[20], // Learner 8 - Bùi Thị Hà
    course: courses[2],
  },
  {
    id: 10,
    comment: 'Rất hài lòng với chất lượng giảng dạy.',
    rating: 5,
    createdAt: new Date('2024-01-26'),
    createdBy: users[29], // Learner 17 - Hồ Văn Sơn
    course: courses[2],
  },

  // Course 7 (Phòng Ngừa Chấn Thương) - 5 feedbacks
  {
    id: 11,
    comment:
      'Khóa học rất hữu ích! Học được cách khởi động đúng cách và tránh chấn thương.',
    rating: 5,
    createdAt: new Date('2024-01-22'),
    createdBy: users[15], // Learner 3
    course: courses[6],
  },
  {
    id: 12,
    comment:
      'Thầy có nền tảng y học nên giảng rất chi tiết về cơ thể và chấn thương.',
    rating: 5,
    createdAt: new Date('2024-01-23'),
    createdBy: users[17], // Learner 5
    course: courses[6],
  },
  {
    id: 13,
    comment: 'Học được nhiều kiến thức về sức khỏe và an toàn khi chơi.',
    rating: 5,
    createdAt: new Date('2024-01-24'),
    createdBy: users[20], // Learner 8
    course: courses[6],
  },
  {
    id: 14,
    comment: 'Rất bổ ích, đặc biệt cho người có chấn thương cũ như mình.',
    rating: 5,
    createdAt: new Date('2024-01-25'),
    createdBy: users[22], // Learner 10
    course: courses[6],
  },
  {
    id: 15,
    comment: 'Khóa học cần thiết cho mọi người chơi pickleball.',
    rating: 4,
    createdAt: new Date('2024-01-26'),
    createdBy: users[27], // Learner 15
    course: courses[6],
  },

  // Course 8 (Dinh Dưỡng Thể Thao - ONGOING) - 1 feedback
  {
    id: 16,
    comment:
      'Học được nhiều về chế độ ăn uống phù hợp cho vận động viên. Rất chuyên nghiệp!',
    rating: 5,
    createdAt: new Date('2024-01-25'),
    createdBy: users[25], // Learner 13 - Mai Văn Nam
    course: courses[7],
  },

  // Course 9 (Chiến Thuật Đôi Cho Giải Đấu) - 3 feedbacks
  {
    id: 17,
    comment:
      'Khóa học chuyên sâu và thực chiến. Giúp mình chuẩn bị tốt cho giải đấu.',
    rating: 5,
    createdAt: new Date('2024-01-25'),
    createdBy: users[22], // Learner 10
    course: courses[8],
  },
  {
    id: 18,
    comment:
      'Cô giáo có kinh nghiệm thi đấu thực tế nên chia sẻ rất hữu ích.',
    rating: 5,
    createdAt: new Date('2024-01-26'),
    createdBy: users[25], // Learner 13
    course: courses[8],
  },
  {
    id: 19,
    comment: 'Mình học được nhiều chiến thuật mới. Rất đáng tiền!',
    rating: 5,
    createdAt: new Date('2024-01-26'),
    createdBy: users[15], // Learner 3
    course: courses[8],
  },

  // Course 10 (Giao Tiếp Trong Thi Đấu Đôi - ONGOING) - 4 feedbacks
  {
    id: 20,
    comment: 'Học được cách giao tiếp hiệu quả với đồng đội. Rất thực tế!',
    rating: 5,
    createdAt: new Date('2024-01-22'),
    createdBy: users[15], // Learner 3
    course: courses[9],
  },
  {
    id: 21,
    comment: 'Khóa học giúp mình tự tin hơn khi chơi đôi.',
    rating: 5,
    createdAt: new Date('2024-01-23'),
    createdBy: users[17], // Learner 5
    course: courses[9],
  },
  {
    id: 22,
    comment: 'Rất bổ ích, đặc biệt phần thực hành giao tiếp.',
    rating: 4,
    createdAt: new Date('2024-01-24'),
    createdBy: users[20], // Learner 8
    course: courses[9],
  },
  {
    id: 23,
    comment: 'Cô giáo dạy nhiệt tình, môi trường học thân thiện.',
    rating: 5,
    createdAt: new Date('2024-01-25'),
    createdBy: users[23], // Learner 11
    course: courses[9],
  },

  // Course 11 (Pickleball Cho Trẻ Em) - 7 feedbacks
  {
    id: 24,
    comment: 'Con mình rất thích học! Thầy dạy vui và dễ hiểu.',
    rating: 5,
    createdAt: new Date('2024-01-23'),
    createdBy: users[13], // Learner 1 (parent)
    course: courses[10],
  },
  {
    id: 25,
    comment: 'Khóa học phù hợp cho trẻ em. Con em tiến bộ rõ rệt.',
    rating: 5,
    createdAt: new Date('2024-01-24'),
    createdBy: users[14], // Learner 2 (parent)
    course: courses[10],
  },
  {
    id: 26,
    comment: 'Thầy rất kiên nhẫn và quan tâm đến từng em.',
    rating: 5,
    createdAt: new Date('2024-01-24'),
    createdBy: users[16], // Learner 4 (parent)
    course: courses[10],
  },
  {
    id: 27,
    comment: 'Con em thích lắm! Buổi học vui vẻ và bổ ích.',
    rating: 5,
    createdAt: new Date('2024-01-25'),
    createdBy: users[18], // Learner 6 (parent)
    course: courses[10],
  },
  {
    id: 28,
    comment: 'Rất hài lòng với khóa học dành cho trẻ em.',
    rating: 5,
    createdAt: new Date('2024-01-25'),
    createdBy: users[24], // Learner 12 (parent)
    course: courses[10],
  },
  {
    id: 29,
    comment: 'Thầy dạy hay và an toàn cho trẻ.',
    rating: 5,
    createdAt: new Date('2024-01-26'),
    createdBy: users[26], // Learner 14 (parent)
    course: courses[10],
  },
  {
    id: 30,
    comment: 'Con em rất thích và hào hứng mỗi buổi học.',
    rating: 5,
    createdAt: new Date('2024-01-26'),
    createdBy: users[28], // Learner 16 (parent)
    course: courses[10],
  },

  // Course 12 (Người Cao Tuổi - ONGOING) - 5 feedbacks
  {
    id: 31,
    comment: 'Khóa học rất phù hợp với người lớn tuổi. Thầy dạy nhẹ nhàng.',
    rating: 5,
    createdAt: new Date('2024-01-19'),
    createdBy: users[13], // Learner 1
    course: courses[11],
  },
  {
    id: 32,
    comment: 'Mình cảm thấy khỏe hơn sau mỗi buổi học.',
    rating: 5,
    createdAt: new Date('2024-01-20'),
    createdBy: users[16], // Learner 4
    course: courses[11],
  },
  {
    id: 33,
    comment: 'Thầy quan tâm đến sức khỏe của từng học viên.',
    rating: 5,
    createdAt: new Date('2024-01-21'),
    createdBy: users[18], // Learner 6
    course: courses[11],
  },
  {
    id: 34,
    comment: 'Bài tập vừa sức, an toàn cho người cao tuổi.',
    rating: 5,
    createdAt: new Date('2024-01-22'),
    createdBy: users[24], // Learner 12
    course: courses[11],
  },
  {
    id: 35,
    comment: 'Rất hài lòng! Lớp học vui vẻ và bổ ích.',
    rating: 5,
    createdAt: new Date('2024-01-23'),
    createdBy: users[28], // Learner 16
    course: courses[11],
  },

  // Course 13 (Tâm Lý Thi Đấu) - 1 feedback
  {
    id: 36,
    comment:
      'Khóa học giúp mình kiểm soát cảm xúc tốt hơn trong thi đấu. Rất đáng học!',
    rating: 5,
    createdAt: new Date('2024-01-26'),
    createdBy: users[22], // Learner 10
    course: courses[12],
  },

  // Course 16 (Dink Game - ONGOING) - 1 feedback
  {
    id: 37,
    comment:
      'Học được kỹ thuật chơi ngắn rất chi tiết. Cô giáo dạy xuất sắc!',
    rating: 5,
    createdAt: new Date('2024-01-25'),
    createdBy: users[25], // Learner 13
    course: courses[15],
  },
];

// Helper functions
export const getFeedbackById = (id: number): Feedback | undefined => {
  return feedbacks.find((feedback) => feedback.id === id);
};

export const getFeedbacksByCourseId = (courseId: number): Feedback[] => {
  return feedbacks.filter((feedback) => feedback.course.id === courseId);
};

export const getFeedbacksByUserId = (userId: number): Feedback[] => {
  return feedbacks.filter((feedback) => feedback.createdBy.id === userId);
};

export const getFeedbacksByRating = (rating: number): Feedback[] => {
  return feedbacks.filter((feedback) => feedback.rating === rating);
};

export const getAverageRatingByCourseId = (courseId: number): number => {
  const courseFeedbacks = getFeedbacksByCourseId(courseId);
  if (courseFeedbacks.length === 0) return 0;

  const total = courseFeedbacks.reduce((sum, f) => sum + f.rating, 0);
  return Math.round((total / courseFeedbacks.length) * 10) / 10; // Round to 1 decimal
};

export const getHighRatedCourses = (): number[] => {
  // Get course IDs with average rating >= 4.5
  const courseIds = [...new Set(feedbacks.map((f) => f.course.id))];
  return courseIds.filter((id) => getAverageRatingByCourseId(id) >= 4.5);
};

