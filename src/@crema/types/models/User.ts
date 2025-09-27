export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  role?: {
    id: string;
    name: string;
  };
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  coachProfile?: any;
}

export interface CreateUserData {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  roleId: string;
  isActive?: boolean;
}

export interface UpdateUserData {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  roleId?: string;
  isActive?: boolean;
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UserFilters {
  search?: string;
  roleId?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}
