import { Schedule } from '@/types/schedule';
import { DayOfWeek } from '@/types/enums';
import { courses } from './courses';

// Schedules - Define recurring schedules for courses
export const schedules: Schedule[] = [
  // Course 1 (Pickleball Cơ Bản) - Thứ 2 & Thứ 5
  {
    id: 1,
    dayOfWeek: DayOfWeek.MONDAY,
    startTime: '14:00:00',
    endTime: '16:00:00',
    course: courses[0],
  },
  {
    id: 2,
    dayOfWeek: DayOfWeek.THURSDAY,
    startTime: '14:00:00',
    endTime: '16:00:00',
    course: courses[0],
  },

  // Course 2 (Chiến Thuật Nâng Cao) - Thứ 2, Thứ 4, Thứ 6
  {
    id: 3,
    dayOfWeek: DayOfWeek.MONDAY,
    startTime: '09:00:00',
    endTime: '11:00:00',
    course: courses[1],
  },
  {
    id: 4,
    dayOfWeek: DayOfWeek.WEDNESDAY,
    startTime: '09:00:00',
    endTime: '11:00:00',
    course: courses[1],
  },
  {
    id: 5,
    dayOfWeek: DayOfWeek.FRIDAY,
    startTime: '09:00:00',
    endTime: '11:00:00',
    course: courses[1],
  },

  // Course 3 (Kỹ Thuật Thi Đấu Đôi) - Thứ 7
  {
    id: 6,
    dayOfWeek: DayOfWeek.SATURDAY,
    startTime: '16:00:00',
    endTime: '18:00:00',
    course: courses[2],
  },

  // Course 7 (Phòng Ngừa Chấn Thương) - Thứ 2
  {
    id: 7,
    dayOfWeek: DayOfWeek.MONDAY,
    startTime: '10:00:00',
    endTime: '12:00:00',
    course: courses[6],
  },

  // Course 8 (Dinh Dưỡng Thể Thao) - Thứ 2
  {
    id: 8,
    dayOfWeek: DayOfWeek.MONDAY,
    startTime: '15:00:00',
    endTime: '17:00:00',
    course: courses[7],
  },

  // Course 9 (Chiến Thuật Đôi Cho Giải Đấu) - Thứ 5
  {
    id: 9,
    dayOfWeek: DayOfWeek.THURSDAY,
    startTime: '18:00:00',
    endTime: '20:00:00',
    course: courses[8],
  },

  // Course 10 (Giao Tiếp Trong Thi Đấu Đôi) - Thứ 5
  {
    id: 10,
    dayOfWeek: DayOfWeek.THURSDAY,
    startTime: '17:00:00',
    endTime: '19:00:00',
    course: courses[9],
  },

  // Course 11 (Pickleball Cho Trẻ Em) - Chủ Nhật
  {
    id: 11,
    dayOfWeek: DayOfWeek.SUNDAY,
    startTime: '08:00:00',
    endTime: '10:00:00',
    course: courses[10],
  },

  // Course 12 (Người Cao Tuổi) - Chủ Nhật
  {
    id: 12,
    dayOfWeek: DayOfWeek.SUNDAY,
    startTime: '07:00:00',
    endTime: '09:00:00',
    course: courses[11],
  },

  // Course 13 (Tâm Lý Thi Đấu) - Thứ 5
  {
    id: 13,
    dayOfWeek: DayOfWeek.THURSDAY,
    startTime: '14:00:00',
    endTime: '16:00:00',
    course: courses[12],
  },

  // Course 14 (Kỹ Thuật Tấn Công) - Chủ Nhật
  {
    id: 14,
    dayOfWeek: DayOfWeek.SUNDAY,
    startTime: '15:00:00',
    endTime: '17:00:00',
    course: courses[13],
  },

  // Course 15 (Chiến Thuật Phòng Thủ) - Thứ 3
  {
    id: 15,
    dayOfWeek: DayOfWeek.TUESDAY,
    startTime: '16:00:00',
    endTime: '18:00:00',
    course: courses[14],
  },

  // Course 16 (Dink Game) - Thứ 2
  {
    id: 16,
    dayOfWeek: DayOfWeek.MONDAY,
    startTime: '13:00:00',
    endTime: '15:00:00',
    course: courses[15],
  },

  // Course 17 (Xây Dựng Nền Tảng) - Thứ 5
  {
    id: 17,
    dayOfWeek: DayOfWeek.THURSDAY,
    startTime: '10:00:00',
    endTime: '12:00:00',
    course: courses[16],
  },

  // Course 18 (Kỹ Thuật Spin) - Thứ 7
  {
    id: 18,
    dayOfWeek: DayOfWeek.SATURDAY,
    startTime: '13:00:00',
    endTime: '15:00:00',
    course: courses[17],
  },
];

// Helper functions
export const getScheduleById = (id: number): Schedule | undefined => {
  return schedules.find((schedule) => schedule.id === id);
};

export const getSchedulesByCourseId = (courseId: number): Schedule[] => {
  return schedules.filter((schedule) => schedule.course.id === courseId);
};

export const getSchedulesByDayOfWeek = (dayOfWeek: DayOfWeek): Schedule[] => {
  return schedules.filter((schedule) => schedule.dayOfWeek === dayOfWeek);
};

