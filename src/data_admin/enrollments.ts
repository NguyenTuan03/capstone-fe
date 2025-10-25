import { Enrollment } from '@/types/enrollment';
import { EnrollmentStatus } from '@/types/enums';
import { courses } from './courses';
import { users } from './users';

// Enrollments - Learners (user id 14-30) enrolling in courses
// Create realistic enrollments with various statuses
export const enrollments: Enrollment[] = [
  // Course 1 (Pickleball Cơ Bản - GROUP) - 8 enrollments
  {
    id: 1,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-18'),
    course: courses[0], // Course 1
    user: users[13], // Learner 1 - Nguyễn Văn An
  },
  {
    id: 2,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-18'),
    course: courses[0],
    user: users[14], // Learner 2 - Trần Thị Bình
  },
  {
    id: 3,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-19'),
    course: courses[0],
    user: users[16], // Learner 4 - Phạm Thị Diệp
  },
  {
    id: 4,
    status: EnrollmentStatus.PENDING_PAYMENT,
    enrolledAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    course: courses[0],
    user: users[18], // Learner 6 - Vũ Thị Phương
  },
  {
    id: 5,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-22'),
    course: courses[0],
    user: users[23], // Learner 11 - Lý Văn Long
  },
  {
    id: 6,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-23'),
    course: courses[0],
    user: users[24], // Learner 12 - Cao Thị Minh
  },
  {
    id: 7,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24'),
    course: courses[0],
    user: users[26], // Learner 14 - Tô Thị Oanh
  },
  {
    id: 8,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-26'),
    course: courses[0],
    user: users[28], // Learner 16 - Trương Thị Quỳnh
  },

  // Course 2 (Chiến Thuật Nâng Cao - INDIVIDUAL) - 1 enrollment
  {
    id: 9,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-12'),
    course: courses[1], // Course 2
    user: users[22], // Learner 10 - Đinh Thị Kim (ADVANCED level)
  },

  // Course 3 (Kỹ Thuật Thi Đấu Đôi - GROUP) - 6 enrollments
  {
    id: 10,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-22'),
    course: courses[2], // Course 3
    user: users[15], // Learner 3 - Lê Văn Cảnh (INTERMEDIATE)
  },
  {
    id: 11,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-23'),
    course: courses[2],
    user: users[17], // Learner 5 - Hoàng Văn Em (INTERMEDIATE)
  },
  {
    id: 12,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-24'),
    course: courses[2],
    user: users[20], // Learner 8 - Bùi Thị Hà (INTERMEDIATE)
  },
  {
    id: 13,
    status: EnrollmentStatus.PENDING_PAYMENT,
    enrolledAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24'),
    course: courses[2],
    user: users[27], // Learner 15 - Đặng Văn Phúc (INTERMEDIATE)
  },
  {
    id: 14,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-26'),
    course: courses[2],
    user: users[29], // Learner 17 - Hồ Văn Sơn (INTERMEDIATE)
  },
  {
    id: 15,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[2],
    user: users[23], // Learner 11 - Lý Văn Long (INTERMEDIATE)
  },

  // Course 7 (Phòng Ngừa Chấn Thương - GROUP) - 7 enrollments
  {
    id: 16,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-20'),
    course: courses[6], // Course 7
    user: users[15], // Learner 3 - Lê Văn Cảnh
  },
  {
    id: 17,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-21'),
    course: courses[6],
    user: users[17], // Learner 5 - Hoàng Văn Em
  },
  {
    id: 18,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-22'),
    course: courses[6],
    user: users[20], // Learner 8 - Bùi Thị Hà
  },
  {
    id: 19,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-23'),
    course: courses[6],
    user: users[22], // Learner 10 - Đinh Thị Kim
  },
  {
    id: 20,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-24'),
    course: courses[6],
    user: users[27], // Learner 15 - Đặng Văn Phúc
  },
  {
    id: 21,
    status: EnrollmentStatus.PENDING_PAYMENT,
    enrolledAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24'),
    course: courses[6],
    user: users[25], // Learner 13 - Mai Văn Nam
  },
  {
    id: 22,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    course: courses[6],
    user: users[29], // Learner 17 - Hồ Văn Sơn
  },

  // Course 8 (Dinh Dưỡng Thể Thao - INDIVIDUAL) - 1 enrollment
  {
    id: 23,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-17'),
    course: courses[7], // Course 8
    user: users[25], // Learner 13 - Mai Văn Nam (ADVANCED)
  },

  // Course 9 (Chiến Thuật Đôi Cho Giải Đấu - GROUP) - 5 enrollments
  {
    id: 24,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-24'),
    course: courses[8], // Course 9
    user: users[22], // Learner 10 - Đinh Thị Kim (ADVANCED)
  },
  {
    id: 25,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-25'),
    course: courses[8],
    user: users[25], // Learner 13 - Mai Văn Nam (ADVANCED)
  },
  {
    id: 26,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-26'),
    course: courses[8],
    user: users[15], // Learner 3 - Lê Văn Cảnh (INTERMEDIATE → upgrading)
  },
  {
    id: 27,
    status: EnrollmentStatus.PENDING_PAYMENT,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[8],
    user: users[27], // Learner 15 - Đặng Văn Phúc (INTERMEDIATE)
  },
  {
    id: 28,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[8],
    user: users[20], // Learner 8 - Bùi Thị Hà (INTERMEDIATE)
  },

  // Course 10 (Giao Tiếp Trong Thi Đấu Đôi - GROUP) - 6 enrollments
  {
    id: 29,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-20'),
    course: courses[9], // Course 10
    user: users[15], // Learner 3
  },
  {
    id: 30,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-21'),
    course: courses[9],
    user: users[17], // Learner 5
  },
  {
    id: 31,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-22'),
    course: courses[9],
    user: users[20], // Learner 8
  },
  {
    id: 32,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-23'),
    course: courses[9],
    user: users[23], // Learner 11
  },
  {
    id: 33,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-24'),
    course: courses[9],
    user: users[27], // Learner 15
  },
  {
    id: 34,
    status: EnrollmentStatus.PENDING_PAYMENT,
    enrolledAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24'),
    course: courses[9],
    user: users[29], // Learner 17
  },

  // Course 11 (Pickleball Cho Trẻ Em - GROUP) - 10 enrollments
  {
    id: 35,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-22'),
    course: courses[10], // Course 11
    user: users[13], // Learner 1
  },
  {
    id: 36,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-22'),
    course: courses[10],
    user: users[14], // Learner 2
  },
  {
    id: 37,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-23'),
    course: courses[10],
    user: users[16], // Learner 4
  },
  {
    id: 38,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-23'),
    course: courses[10],
    user: users[18], // Learner 6
  },
  {
    id: 39,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-24'),
    course: courses[10],
    user: users[24], // Learner 12
  },
  {
    id: 40,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-24'),
    course: courses[10],
    user: users[26], // Learner 14
  },
  {
    id: 41,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-25'),
    course: courses[10],
    user: users[28], // Learner 16
  },
  {
    id: 42,
    status: EnrollmentStatus.PENDING_PAYMENT,
    enrolledAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    course: courses[10],
    user: users[19], // Learner 7
  },
  {
    id: 43,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[10],
    user: users[23], // Learner 11
  },
  {
    id: 44,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[10],
    user: users[27], // Learner 15
  },

  // Course 12 (Người Cao Tuổi - GROUP) - 7 enrollments
  {
    id: 45,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-17'),
    course: courses[11], // Course 12
    user: users[13], // Learner 1
  },
  {
    id: 46,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-18'),
    course: courses[11],
    user: users[16], // Learner 4
  },
  {
    id: 47,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-19'),
    course: courses[11],
    user: users[18], // Learner 6
  },
  {
    id: 48,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-20'),
    course: courses[11],
    user: users[24], // Learner 12
  },
  {
    id: 49,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-21'),
    course: courses[11],
    user: users[28], // Learner 16
  },
  {
    id: 50,
    status: EnrollmentStatus.PENDING_PAYMENT,
    enrolledAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21'),
    course: courses[11],
    user: users[19], // Learner 7
  },
  {
    id: 51,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-23'),
    course: courses[11],
    user: users[26], // Learner 14
  },

  // Course 13 (Tâm Lý Thi Đấu - INDIVIDUAL) - 1 enrollment
  {
    id: 52,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-25'),
    course: courses[12], // Course 13
    user: users[22], // Learner 10 - Đinh Thị Kim (ADVANCED)
  },

  // Course 14 (Kỹ Thuật Tấn Công - GROUP) - 4 enrollments
  {
    id: 53,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    course: courses[13], // Course 14
    user: users[22], // Learner 10
  },
  {
    id: 54,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    course: courses[13],
    user: users[25], // Learner 13
  },
  {
    id: 55,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[13],
    user: users[15], // Learner 3
  },
  {
    id: 56,
    status: EnrollmentStatus.PENDING_PAYMENT,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[13],
    user: users[27], // Learner 15
  },

  // Course 15 (Chiến Thuật Phòng Thủ - GROUP) - 5 enrollments
  {
    id: 57,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[14], // Course 15
    user: users[15], // Learner 3
  },
  {
    id: 58,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[14],
    user: users[17], // Learner 5
  },
  {
    id: 59,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[14],
    user: users[20], // Learner 8
  },
  {
    id: 60,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[14],
    user: users[23], // Learner 11
  },
  {
    id: 61,
    status: EnrollmentStatus.PENDING_PAYMENT,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[14],
    user: users[29], // Learner 17
  },

  // Course 16 (Dink Game - INDIVIDUAL) - 1 enrollment
  {
    id: 62,
    status: EnrollmentStatus.CONFIRMED,
    enrolledAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-22'),
    course: courses[15], // Course 16
    user: users[25], // Learner 13 - Mai Văn Nam (ADVANCED)
  },

  // Course 17 (Xây Dựng Nền Tảng - GROUP) - 8 enrollments
  {
    id: 63,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[16], // Course 17
    user: users[13], // Learner 1
  },
  {
    id: 64,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[16],
    user: users[14], // Learner 2
  },
  {
    id: 65,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[16],
    user: users[16], // Learner 4
  },
  {
    id: 66,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[16],
    user: users[18], // Learner 6
  },
  {
    id: 67,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[16],
    user: users[24], // Learner 12
  },
  {
    id: 68,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[16],
    user: users[26], // Learner 14
  },
  {
    id: 69,
    status: EnrollmentStatus.PENDING_PAYMENT,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[16],
    user: users[28], // Learner 16
  },
  {
    id: 70,
    status: EnrollmentStatus.PENDING_GROUP,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[16],
    user: users[19], // Learner 7
  },

  // Course 18 (Kỹ Thuật Spin - INDIVIDUAL) - 1 enrollment
  {
    id: 71,
    status: EnrollmentStatus.PENDING_PAYMENT,
    enrolledAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    course: courses[17], // Course 18
    user: users[22], // Learner 10 - Đinh Thị Kim (ADVANCED)
  },
];

// Helper functions
export const getEnrollmentById = (id: number): Enrollment | undefined => {
  return enrollments.find((enrollment) => enrollment.id === id);
};

export const getEnrollmentsByCourseId = (courseId: number): Enrollment[] => {
  return enrollments.filter((enrollment) => enrollment.course.id === courseId);
};

export const getEnrollmentsByUserId = (userId: number): Enrollment[] => {
  return enrollments.filter((enrollment) => enrollment.user.id === userId);
};

export const getEnrollmentsByStatus = (
  status: EnrollmentStatus,
): Enrollment[] => {
  return enrollments.filter((enrollment) => enrollment.status === status);
};

export const getConfirmedEnrollments = (): Enrollment[] => {
  return getEnrollmentsByStatus(EnrollmentStatus.CONFIRMED);
};

export const getPendingEnrollments = (): Enrollment[] => {
  return enrollments.filter(
    (e) =>
      e.status === EnrollmentStatus.PENDING_GROUP ||
      e.status === EnrollmentStatus.PENDING_PAYMENT,
  );
};

