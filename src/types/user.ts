import { Role } from './role';
import { Wallet } from './wallet';
import { Achievement } from './achievement';
import { AchievementProgress } from './achievement-progress';
import { LearnerAchievement } from './learner-achievement';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  profilePicture?: string;
  refreshToken?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  resetPasswordToken?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  role: Role;
  wallet?: Wallet;
  achievements?: Achievement[]; // Achievements created by this user (admin/coach)
  achievementProgresses?: AchievementProgress[]; // Progress on achievements (learner)
  learnerAchievements?: LearnerAchievement[]; // Earned achievements (learner)
}

// API types for userApi service
export interface UserListStats {
  total: number;
  active: number;
  blocked: number;
  pending: number;
  learners: number;
  coaches: number;
}

export interface GetUsersParams {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  status?: string;
  skillLevel?: string;
}

export interface GetUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface BlockUserRequest {
  userId: string;
  reason: string;
  adminId: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
