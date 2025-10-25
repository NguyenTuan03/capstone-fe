import { User } from '@/types/user';
import { roles } from './roles';

// 36 users: 1 admin, 18 coaches (12 verified + 3 pending + 3 rejected), 17 learners
export const users: User[] = [
  // ========== 1 ADMIN ==========
  {
    id: 1,
    fullName: 'Admin Hệ Thống',
    email: 'admin@picklelearn.vn',
    phoneNumber: '+84901000000',
    password: 'hashed_password_admin', // In reality, this would be bcrypt hashed
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-26T10:00:00Z'),
    role: roles[0], // ADMIN
  },

  // ========== 12 COACHES ==========
  {
    id: 2,
    fullName: 'Nguyễn Văn Minh',
    email: 'nguyen.van.minh@coach.vn',
    phoneNumber: '+84901111001',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2023-06-15T00:00:00Z'),
    updatedAt: new Date('2024-01-26T14:30:00Z'),
    role: roles[1], // COACH
  },
  {
    id: 3,
    fullName: 'Trần Thị Hương',
    email: 'tran.thi.huong@coach.vn',
    phoneNumber: '+84901111002',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616c6c4a09e?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2023-08-20T00:00:00Z'),
    updatedAt: new Date('2024-01-26T16:45:00Z'),
    role: roles[1], // COACH
  },
  {
    id: 4,
    fullName: 'Lê Văn Cường',
    email: 'le.van.cuong@coach.vn',
    phoneNumber: '+84901111003',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: false, // Suspended
    createdAt: new Date('2023-04-10T00:00:00Z'),
    updatedAt: new Date('2024-01-20T10:15:00Z'),
    role: roles[1], // COACH
  },
  {
    id: 5,
    fullName: 'Phạm Thị Mai',
    email: 'pham.thi.mai@coach.vn',
    phoneNumber: '+84901111004',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-20T00:00:00Z'),
    updatedAt: new Date('2024-01-26T08:00:00Z'),
    role: roles[1], // COACH
  },
  {
    id: 6,
    fullName: 'Hoàng Văn Đức',
    email: 'hoang.van.duc@coach.vn',
    phoneNumber: '+84901111005',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2023-09-05T00:00:00Z'),
    updatedAt: new Date('2024-01-26T11:20:00Z'),
    role: roles[1], // COACH
  },
  {
    id: 7,
    fullName: 'Vũ Thị Lan',
    email: 'vu.thi.lan@coach.vn',
    phoneNumber: '+84901111006',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2023-07-12T00:00:00Z'),
    updatedAt: new Date('2024-01-25T09:15:00Z'),
    role: roles[1], // COACH
  },
  {
    id: 8,
    fullName: 'Đỗ Văn Thành',
    email: 'do.van.thanh@coach.vn',
    phoneNumber: '+84901111007',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2023-05-18T00:00:00Z'),
    updatedAt: new Date('2024-01-26T13:00:00Z'),
    role: roles[1], // COACH
  },
  {
    id: 9,
    fullName: 'Bùi Thị Nga',
    email: 'bui.thi.nga@coach.vn',
    phoneNumber: '+84901111008',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2023-10-22T00:00:00Z'),
    updatedAt: new Date('2024-01-26T15:30:00Z'),
    role: roles[1], // COACH
  },
  {
    id: 10,
    fullName: 'Ngô Văn Hải',
    email: 'ngo.van.hai@coach.vn',
    phoneNumber: '+84901111009',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2023-11-08T00:00:00Z'),
    updatedAt: new Date('2024-01-26T10:45:00Z'),
    role: roles[1], // COACH
  },
  {
    id: 11,
    fullName: 'Đinh Thị Phương',
    email: 'dinh.thi.phuong@coach.vn',
    phoneNumber: '+84901111010',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2023-03-25T00:00:00Z'),
    updatedAt: new Date('2024-01-26T12:00:00Z'),
    role: roles[1], // COACH
  },
  {
    id: 12,
    fullName: 'Lý Văn Tài',
    email: 'ly.van.tai@coach.vn',
    phoneNumber: '+84901111011',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2023-12-05T00:00:00Z'),
    updatedAt: new Date('2024-01-26T14:00:00Z'),
    role: roles[1], // COACH
  },
  {
    id: 13,
    fullName: 'Cao Thị Tâm',
    email: 'cao.thi.tam@coach.vn',
    phoneNumber: '+84901111012',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2023-02-14T00:00:00Z'),
    updatedAt: new Date('2024-01-25T16:20:00Z'),
    role: roles[1], // COACH
  },

  // ========== 17 LEARNERS ==========
  {
    id: 14,
    fullName: 'Nguyễn Văn An',
    email: 'nguyen.van.an@learner.vn',
    phoneNumber: '+84902222001',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-26T09:00:00Z'),
    role: roles[2], // LEARNER
  },
  {
    id: 15,
    fullName: 'Trần Thị Bình',
    email: 'tran.thi.binh@learner.vn',
    phoneNumber: '+84902222002',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-02T00:00:00Z'),
    updatedAt: new Date('2024-01-26T10:30:00Z'),
    role: roles[2], // LEARNER
  },
  {
    id: 16,
    fullName: 'Lê Văn Cảnh',
    email: 'le.van.canh@learner.vn',
    phoneNumber: '+84902222003',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-03T00:00:00Z'),
    updatedAt: new Date('2024-01-26T11:15:00Z'),
    role: roles[2], // LEARNER
  },
  {
    id: 17,
    fullName: 'Phạm Thị Diệp',
    email: 'pham.thi.diep@learner.vn',
    phoneNumber: '+84902222004',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-04T00:00:00Z'),
    updatedAt: new Date('2024-01-26T08:45:00Z'),
    role: roles[2], // LEARNER
  },
  {
    id: 18,
    fullName: 'Hoàng Văn Em',
    email: 'hoang.van.em@learner.vn',
    phoneNumber: '+84902222005',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-05T00:00:00Z'),
    updatedAt: new Date('2024-01-26T13:20:00Z'),
    role: roles[2], // LEARNER
  },
  {
    id: 19,
    fullName: 'Vũ Thị Phương',
    email: 'vu.thi.phuong@learner.vn',
    phoneNumber: '+84902222006',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-06T00:00:00Z'),
    updatedAt: new Date('2024-01-26T14:50:00Z'),
    role: roles[2], // LEARNER
  },
  {
    id: 20,
    fullName: 'Đỗ Văn Giang',
    email: 'do.van.giang@learner.vn',
    phoneNumber: '+84902222007',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: false,
    isActive: true,
    createdAt: new Date('2024-01-07T00:00:00Z'),
    updatedAt: new Date('2024-01-26T15:30:00Z'),
    role: roles[2], // LEARNER
  },
  {
    id: 21,
    fullName: 'Bùi Thị Hà',
    email: 'bui.thi.ha@learner.vn',
    phoneNumber: '+84902222008',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-08T00:00:00Z'),
    updatedAt: new Date('2024-01-26T09:40:00Z'),
    role: roles[2], // LEARNER
  },
  {
    id: 22,
    fullName: 'Ngô Văn Ích',
    email: 'ngo.van.ich@learner.vn',
    phoneNumber: '+84902222009',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: false, // Inactive
    createdAt: new Date('2024-01-09T00:00:00Z'),
    updatedAt: new Date('2024-01-15T00:00:00Z'),
    role: roles[2], // LEARNER
  },
  {
    id: 23,
    fullName: 'Đinh Thị Kim',
    email: 'dinh.thi.kim@learner.vn',
    phoneNumber: '+84902222010',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-10T00:00:00Z'),
    updatedAt: new Date('2024-01-26T16:00:00Z'),
    role: roles[2], // LEARNER
  },
  {
    id: 24,
    fullName: 'Lý Văn Long',
    email: 'ly.van.long@learner.vn',
    phoneNumber: '+84902222011',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-11T00:00:00Z'),
    updatedAt: new Date('2024-01-26T10:20:00Z'),
    role: roles[2], // LEARNER
  },
  {
    id: 25,
    fullName: 'Cao Thị Minh',
    email: 'cao.thi.minh@learner.vn',
    phoneNumber: '+84902222012',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-12T00:00:00Z'),
    updatedAt: new Date('2024-01-26T11:50:00Z'),
    role: roles[2], // LEARNER
  },
  {
    id: 26,
    fullName: 'Mai Văn Nam',
    email: 'mai.van.nam@learner.vn',
    phoneNumber: '+84902222013',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1531427186611-ad02f065fe8c?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-13T00:00:00Z'),
    updatedAt: new Date('2024-01-26T12:30:00Z'),
    role: roles[2], // LEARNER
  },
  {
    id: 27,
    fullName: 'Tô Thị Oanh',
    email: 'to.thi.oanh@learner.vn',
    phoneNumber: '+84902222014',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-14T00:00:00Z'),
    updatedAt: new Date('2024-01-26T13:45:00Z'),
    role: roles[2], // LEARNER
  },
  {
    id: 28,
    fullName: 'Đặng Văn Phúc',
    email: 'dang.van.phuc@learner.vn',
    phoneNumber: '+84902222015',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-15T00:00:00Z'),
    updatedAt: new Date('2024-01-26T14:15:00Z'),
    role: roles[2], // LEARNER
  },
  {
    id: 29,
    fullName: 'Trương Thị Quỳnh',
    email: 'truong.thi.quynh@learner.vn',
    phoneNumber: '+84902222016',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-16T00:00:00Z'),
    updatedAt: new Date('2024-01-26T15:10:00Z'),
    role: roles[2], // LEARNER
  },
  {
    id: 30,
    fullName: 'Hồ Văn Sơn',
    email: 'ho.van.son@learner.vn',
    phoneNumber: '+84902222017',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-17T00:00:00Z'),
    updatedAt: new Date('2024-01-26T16:25:00Z'),
    role: roles[2], // LEARNER
  },

  // ========== 3 PENDING COACHES ==========
  {
    id: 31,
    fullName: 'Phan Văn Thắng',
    email: 'phan.van.thang@pending.vn',
    phoneNumber: '+84904444001',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-23T00:00:00Z'),
    updatedAt: new Date('2024-01-26T08:00:00Z'),
    role: roles[1], // COACH
  },
  {
    id: 32,
    fullName: 'Võ Thị Thu',
    email: 'vo.thi.thu@pending.vn',
    phoneNumber: '+84904444002',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-24T00:00:00Z'),
    updatedAt: new Date('2024-01-26T09:30:00Z'),
    role: roles[1], // COACH
  },
  {
    id: 33,
    fullName: 'Trịnh Văn Vương',
    email: 'trinh.van.vuong@pending.vn',
    phoneNumber: '+84904444003',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-25T00:00:00Z'),
    updatedAt: new Date('2024-01-26T11:00:00Z'),
    role: roles[1], // COACH
  },

  // ========== 3 REJECTED COACHES ==========
  {
    id: 34,
    fullName: 'Nguyễn Văn Tuấn',
    email: 'nguyen.van.tuan@rejected.vn',
    phoneNumber: '+84903333001',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: false, // Rejected/suspended
    createdAt: new Date('2024-01-10T00:00:00Z'),
    updatedAt: new Date('2024-01-22T10:00:00Z'),
    role: roles[1], // COACH
  },
  {
    id: 35,
    fullName: 'Trần Thị Linh',
    email: 'tran.thi.linh@rejected.vn',
    phoneNumber: '+84903333002',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: false, // Rejected/suspended
    createdAt: new Date('2024-01-12T00:00:00Z'),
    updatedAt: new Date('2024-01-23T14:30:00Z'),
    role: roles[1], // COACH
  },
  {
    id: 36,
    fullName: 'Lê Văn Khoa',
    email: 'le.van.khoa@rejected.vn',
    phoneNumber: '+84903333003',
    password: 'hashed_password',
    profilePicture: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face',
    isEmailVerified: true,
    isActive: false, // Rejected/suspended
    createdAt: new Date('2024-01-15T00:00:00Z'),
    updatedAt: new Date('2024-01-24T16:20:00Z'),
    role: roles[1], // COACH
  },
];

// Helper functions
export const getUserById = (id: number): User | undefined => {
  return users.find((user) => user.id === id);
};

export const getUsersByRole = (roleId: number): User[] => {
  return users.filter((user) => user.role.id === roleId);
};

export const getCoachUsers = (): User[] => {
  return getUsersByRole(2); // Role COACH
};

export const getLearnerUsers = (): User[] => {
  return getUsersByRole(3); // Role LEARNER
};

export const getActiveUsers = (): User[] => {
  return users.filter((user) => user.isActive);
};

// Mock data for userApi service compatibility
export const usersData = {
  users: users,
  blockReasons: [
    'Vi phạm quy định sử dụng',
    'Spam hoặc quấy rối người dùng khác',
    'Sử dụng ngôn từ không phù hợp',
    'Lừa đảo hoặc giả mạo',
    'Vi phạm bản quyền',
    'Hành vi không đúng mực',
    'Yêu cầu từ cơ quan chức năng',
    'Lý do khác',
  ],
};
