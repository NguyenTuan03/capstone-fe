// User Management Types

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'learner' | 'coach' | 'admin';
  status: 'active' | 'blocked' | 'pending';
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  location?: string;
  joinDate: string;
  lastLogin?: string;
  totalSessions?: number;
  totalSpent?: number;

  // Block info
  blockReason?: string;
  blockedAt?: string;
  blockedBy?: string;

  // Stats
  stats?: {
    completedLessons: number;
    totalLessons: number;
    currentLevel: string;
    achievements: string[];
  };
}

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
