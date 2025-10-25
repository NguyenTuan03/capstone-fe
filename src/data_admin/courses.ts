import { Course } from '@/types/course';
import {
  CourseLearningFormat,
  CourseStatus,
  PickleballLevel,
} from '@/types/enums';
import { users } from './users';

// 23 courses total - each coach has 1-2 courses
// Status breakdown: 3 original PENDING + 5 new PENDING = 8 PENDING_APPROVAL courses
export const courses: Course[] = [
  // Coach 1 (Nguyễn Văn Minh - user id 2) - 2 courses
  {
    id: 1,
    name: 'Pickleball Cơ Bản Cho Người Mới Bắt Đầu',
    description:
      'Khóa học cơ bản dành cho người mới, bao gồm kỹ thuật nắm vợt, di chuyển, và các quy tắc cơ bản.',
    level: PickleballLevel.BEGINNER,
    learningFormat: CourseLearningFormat.GROUP,
    status: CourseStatus.APPROVED,
    minParticipants: 5,
    maxParticipants: 10,
    pricePerParticipant: 1500000,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-03-31'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-26'),
    createdBy: users[1],
  },
  {
    id: 2,
    name: 'Chiến Thuật Nâng Cao',
    description:
      'Khóa học chuyên sâu về chiến thuật thi đấu, phân tích đối thủ và xây dựng lối chơi hiệu quả.',
    level: PickleballLevel.ADVANCED,
    learningFormat: CourseLearningFormat.INDIVIDUAL,
    status: CourseStatus.ONGOING,
    minParticipants: 1,
    maxParticipants: 1,
    pricePerParticipant: 3000000,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-28'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-26'),
    createdBy: users[1],
  },

  // Coach 2 (Trần Thị Hương - user id 3) - 1 course
  {
    id: 3,
    name: 'Kỹ Thuật Thi Đấu Đôi',
    description:
      'Học cách phối hợp với đồng đội, chiến thuật đôi, và giao tiếp trên sân.',
    level: PickleballLevel.INTERMEDIATE,
    learningFormat: CourseLearningFormat.GROUP,
    status: CourseStatus.APPROVED,
    minParticipants: 4,
    maxParticipants: 8,
    pricePerParticipant: 1800000,
    startDate: new Date('2024-02-10'),
    endDate: new Date('2024-04-10'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-26'),
    createdBy: users[2],
  },

  // Coach 3 (Lê Văn Cường - user id 4) - 2 courses
  {
    id: 4,
    name: 'Chuẩn Bị Thi Đấu Chuyên Nghiệp',
    description:
      'Khóa học dành cho vận động viên chuẩn bị tham gia giải đấu chuyên nghiệp.',
    level: PickleballLevel.PROFESSIONAL,
    learningFormat: CourseLearningFormat.INDIVIDUAL,
    status: CourseStatus.CANCELLED, // Coach suspended
    minParticipants: 1,
    maxParticipants: 1,
    pricePerParticipant: 5000000,
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-02-20'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-22'),
    createdBy: users[3],
  },
  {
    id: 5,
    name: 'Kỹ Thuật Serve Chuyên Nghiệp',
    description: 'Hoàn thiện kỹ thuật serve với nhiều biến tấu và độ chính xác cao.',
    level: PickleballLevel.ADVANCED,
    learningFormat: CourseLearningFormat.GROUP,
    status: CourseStatus.CANCELLED, // Coach suspended
    minParticipants: 3,
    maxParticipants: 6,
    pricePerParticipant: 2500000,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-03-15'),
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-22'),
    createdBy: users[3],
  },

  // Coach 4 (Phạm Thị Mai - user id 5) - 1 course
  {
    id: 6,
    name: 'Pickleball Nhập Môn',
    description: 'Khóa học thân thiện cho người mới, không cần kinh nghiệm.',
    level: PickleballLevel.BEGINNER,
    learningFormat: CourseLearningFormat.GROUP,
    status: CourseStatus.PENDING_APPROVAL, // Coach pending
    minParticipants: 6,
    maxParticipants: 12,
    pricePerParticipant: 1200000,
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-04-15'),
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-26'),
    createdBy: users[4],
  },

  // Coach 5 (Hoàng Văn Đức - user id 6) - 2 courses
  {
    id: 7,
    name: 'Phòng Ngừa Chấn Thương Trong Pickleball',
    description:
      'Học cách chơi an toàn, kỹ thuật khởi động, và phục hồi sau chấn thương.',
    level: PickleballLevel.INTERMEDIATE,
    learningFormat: CourseLearningFormat.GROUP,
    status: CourseStatus.APPROVED,
    minParticipants: 5,
    maxParticipants: 10,
    pricePerParticipant: 2000000,
    startDate: new Date('2024-02-05'),
    endDate: new Date('2024-03-20'),
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-26'),
    createdBy: users[5],
  },
  {
    id: 8,
    name: 'Dinh Dưỡng Thể Thao Cho Pickleball',
    description:
      'Tìm hiểu chế độ dinh dưỡng phù hợp để nâng cao hiệu suất thi đấu.',
    level: PickleballLevel.INTERMEDIATE,
    learningFormat: CourseLearningFormat.INDIVIDUAL,
    status: CourseStatus.ONGOING,
    minParticipants: 1,
    maxParticipants: 1,
    pricePerParticipant: 1500000,
    startDate: new Date('2024-01-22'),
    endDate: new Date('2024-02-22'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-26'),
    createdBy: users[5],
  },

  // Coach 6 (Vũ Thị Lan - user id 7) - 2 courses
  {
    id: 9,
    name: 'Chiến Thuật Đôi Cho Giải Đấu',
    description: 'Chiến thuật chuyên sâu cho các cặp đôi tham gia giải đấu.',
    level: PickleballLevel.ADVANCED,
    learningFormat: CourseLearningFormat.GROUP,
    status: CourseStatus.APPROVED,
    minParticipants: 4,
    maxParticipants: 6,
    pricePerParticipant: 2800000,
    startDate: new Date('2024-02-08'),
    endDate: new Date('2024-03-30'),
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-26'),
    createdBy: users[6],
  },
  {
    id: 10,
    name: 'Giao Tiếp Trong Thi Đấu Đôi',
    description: 'Học cách giao tiếp hiệu quả với đồng đội trong thi đấu.',
    level: PickleballLevel.INTERMEDIATE,
    learningFormat: CourseLearningFormat.GROUP,
    status: CourseStatus.ONGOING,
    minParticipants: 4,
    maxParticipants: 8,
    pricePerParticipant: 1600000,
    startDate: new Date('2024-01-25'),
    endDate: new Date('2024-03-10'),
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-26'),
    createdBy: users[6],
  },

  // Coach 7 (Đỗ Văn Thành - user id 8) - 2 courses
  {
    id: 11,
    name: 'Pickleball Cho Trẻ Em 8-12 Tuổi',
    description:
      'Khóa học vui nhộn và an toàn dành riêng cho trẻ em, phát triển kỹ năng vận động.',
    level: PickleballLevel.BEGINNER,
    learningFormat: CourseLearningFormat.GROUP,
    status: CourseStatus.APPROVED,
    minParticipants: 6,
    maxParticipants: 15,
    pricePerParticipant: 1000000,
    startDate: new Date('2024-02-12'),
    endDate: new Date('2024-04-12'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-26'),
    createdBy: users[7],
  },
  {
    id: 12,
    name: 'Pickleball Cho Người Cao Tuổi',
    description:
      'Khóa học nhẹ nhàng, an toàn cho người cao tuổi, cải thiện sức khỏe và tinh thần.',
    level: PickleballLevel.BEGINNER,
    learningFormat: CourseLearningFormat.GROUP,
    status: CourseStatus.ONGOING,
    minParticipants: 5,
    maxParticipants: 10,
    pricePerParticipant: 1200000,
    startDate: new Date('2024-01-28'),
    endDate: new Date('2024-03-28'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-26'),
    createdBy: users[7],
  },

  // Coach 8 (Bùi Thị Nga - user id 9) - 1 course
  {
    id: 13,
    name: 'Tâm Lý Thi Đấu Pickleball',
    description:
      'Học cách kiểm soát cảm xúc, tập trung và vượt qua áp lực trong thi đấu.',
    level: PickleballLevel.INTERMEDIATE,
    learningFormat: CourseLearningFormat.INDIVIDUAL,
    status: CourseStatus.APPROVED,
    minParticipants: 1,
    maxParticipants: 1,
    pricePerParticipant: 2500000,
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-03-31'),
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-26'),
    createdBy: users[8],
  },

  // Coach 9 (Ngô Văn Hải - user id 10) - 1 course
  {
    id: 14,
    name: 'Kỹ Thuật Tấn Công Mạnh Mẽ',
    description: 'Phát triển kỹ thuật smash, power serve và lối chơi tấn công.',
    level: PickleballLevel.ADVANCED,
    learningFormat: CourseLearningFormat.GROUP,
    status: CourseStatus.APPROVED,
    minParticipants: 3,
    maxParticipants: 6,
    pricePerParticipant: 2200000,
    startDate: new Date('2024-02-18'),
    endDate: new Date('2024-04-05'),
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-26'),
    createdBy: users[9],
  },

  // Coach 10 (Đinh Thị Phương - user id 11) - 2 courses
  {
    id: 15,
    name: 'Chiến Thuật Phòng Thủ Vững Chắc',
    description: 'Xây dựng lối chơi phòng thủ kiên cố và phản công hiệu quả.',
    level: PickleballLevel.INTERMEDIATE,
    learningFormat: CourseLearningFormat.GROUP,
    status: CourseStatus.APPROVED,
    minParticipants: 4,
    maxParticipants: 8,
    pricePerParticipant: 1900000,
    startDate: new Date('2024-02-20'),
    endDate: new Date('2024-04-15'),
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-26'),
    createdBy: users[10],
  },
  {
    id: 16,
    name: 'Dink Game - Nghệ Thuật Chơi Ngắn',
    description: 'Hoàn thiện kỹ thuật dink, khống chế bóng và kiên nhẫn trong thi đấu.',
    level: PickleballLevel.ADVANCED,
    learningFormat: CourseLearningFormat.INDIVIDUAL,
    status: CourseStatus.ONGOING,
    minParticipants: 1,
    maxParticipants: 1,
    pricePerParticipant: 2800000,
    startDate: new Date('2024-01-29'),
    endDate: new Date('2024-03-15'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-26'),
    createdBy: users[10],
  },

  // Coach 11 (Lý Văn Tài - user id 12) - 1 course
  {
    id: 17,
    name: 'Xây Dựng Nền Tảng Pickleball',
    description:
      'Khóa học từng bước xây dựng nền tảng vững chắc cho người mới bắt đầu.',
    level: PickleballLevel.BEGINNER,
    learningFormat: CourseLearningFormat.GROUP,
    status: CourseStatus.APPROVED,
    minParticipants: 6,
    maxParticipants: 12,
    pricePerParticipant: 1400000,
    startDate: new Date('2024-02-22'),
    endDate: new Date('2024-04-22'),
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    createdBy: users[11],
  },

  // Coach 12 (Cao Thị Tâm - user id 13) - 1 course
  {
    id: 18,
    name: 'Kỹ Thuật Spin và Placement',
    description:
      'Học cách sử dụng spin hiệu quả và đặt bóng chính xác vào vị trí mong muốn.',
    level: PickleballLevel.ADVANCED,
    learningFormat: CourseLearningFormat.INDIVIDUAL,
    status: CourseStatus.APPROVED,
    minParticipants: 1,
    maxParticipants: 1,
    pricePerParticipant: 3200000,
    startDate: new Date('2024-02-25'),
    endDate: new Date('2024-04-10'),
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    createdBy: users[12],
  },

  // Coach 6 (Hoàng Văn Đức - user id 7) - 1 pending course
  {
    id: 19,
    name: 'Kỹ Thuật Smash Mạnh Mẽ',
    description:
      'Khóa học chuyên sâu về kỹ thuật smash, tăng sức mạnh và độ chính xác trong các pha tấn công.',
    level: PickleballLevel.INTERMEDIATE,
    learningFormat: CourseLearningFormat.GROUP,
    status: CourseStatus.PENDING_APPROVAL,
    minParticipants: 4,
    maxParticipants: 8,
    pricePerParticipant: 2000000,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-04-30'),
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28'),
    createdBy: users[6],
  },

  // Coach 8 (Đinh Văn Hải - user id 9) - 1 pending course
  {
    id: 20,
    name: 'Chiến Thuật Phòng Thủ Hiệu Quả',
    description:
      'Học cách phòng thủ thông minh, đọc đường bóng và phản công nhanh chóng.',
    level: PickleballLevel.INTERMEDIATE,
    learningFormat: CourseLearningFormat.GROUP,
    status: CourseStatus.PENDING_APPROVAL,
    minParticipants: 5,
    maxParticipants: 10,
    pricePerParticipant: 1700000,
    startDate: new Date('2024-02-20'),
    endDate: new Date('2024-04-20'),
    createdAt: new Date('2024-01-27'),
    updatedAt: new Date('2024-01-27'),
    createdBy: users[8],
  },

  // Coach 10 (Vũ Thị Kim - user id 11) - 1 pending course
  {
    id: 21,
    name: 'Pickleball Cho Người Cao Tuổi',
    description:
      'Khóa học nhẹ nhàng dành cho người cao tuổi, tập trung vào sức khỏe và vận động an toàn.',
    level: PickleballLevel.BEGINNER,
    learningFormat: CourseLearningFormat.GROUP,
    status: CourseStatus.PENDING_APPROVAL,
    minParticipants: 6,
    maxParticipants: 12,
    pricePerParticipant: 1200000,
    startDate: new Date('2024-03-05'),
    endDate: new Date('2024-05-05'),
    createdAt: new Date('2024-01-29'),
    updatedAt: new Date('2024-01-29'),
    createdBy: users[10],
  },

  // Coach 11 (Trương Văn Long - user id 12) - 1 pending course
  {
    id: 22,
    name: 'Kỹ Thuật Volley Chuyên Nghiệp',
    description:
      'Hoàn thiện kỹ thuật volley ở lưới, timing và phản xạ nhanh.',
    level: PickleballLevel.ADVANCED,
    learningFormat: CourseLearningFormat.INDIVIDUAL,
    status: CourseStatus.PENDING_APPROVAL,
    minParticipants: 1,
    maxParticipants: 1,
    pricePerParticipant: 3500000,
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-03-30'),
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28'),
    createdBy: users[11],
  },

  // Coach 5 (Nguyễn Thị Mai - user id 6) - 1 pending course
  {
    id: 23,
    name: 'Tâm Lý Thi Đấu Và Chiến Thuật',
    description:
      'Khóa học về tâm lý học thể thao, kiểm soát cảm xúc và xây dựng chiến thuật phù hợp.',
    level: PickleballLevel.ADVANCED,
    learningFormat: CourseLearningFormat.GROUP,
    status: CourseStatus.PENDING_APPROVAL,
    minParticipants: 4,
    maxParticipants: 8,
    pricePerParticipant: 2800000,
    startDate: new Date('2024-03-10'),
    endDate: new Date('2024-05-10'),
    createdAt: new Date('2024-01-29'),
    updatedAt: new Date('2024-01-29'),
    createdBy: users[5],
  },
];

// Helper functions
export const getCourseById = (id: number): Course | undefined => {
  return courses.find((course) => course.id === id);
};

export const getCoursesByCoachUserId = (userId: number): Course[] => {
  return courses.filter((course) => course.createdBy.id === userId);
};

export const getCoursesByStatus = (status: CourseStatus): Course[] => {
  return courses.filter((course) => course.status === status);
};

export const getCoursesByLevel = (level: PickleballLevel): Course[] => {
  return courses.filter((course) => course.level === level);
};

export const getCoursesByLearningFormat = (
  format: CourseLearningFormat,
): Course[] => {
  return courses.filter((course) => course.learningFormat === format);
};

export const getApprovedCourses = (): Course[] => {
  return getCoursesByStatus(CourseStatus.APPROVED);
};

export const getOngoingCourses = (): Course[] => {
  return getCoursesByStatus(CourseStatus.ONGOING);
};

export const getPendingCourses = (): Course[] => {
  return getCoursesByStatus(CourseStatus.PENDING_APPROVAL);
};

