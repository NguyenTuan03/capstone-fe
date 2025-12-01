import jwtAxios, { ApiUrl } from '@/@crema/services/jwt-auth';

const API_URL = `${ApiUrl}/users`;

// -------------------- Interfaces --------------------
export interface Role {
  id: number;
  name: string;
}

export interface Wallet {
  id: number;
  bankAccountNumber: string | null;
  currentBalance: string;
  totalIncome: string;
  createdAt: string;
  updatedAt: string;
  bank?: string | null;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  profilePicture: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  role: Role;
  wallet: Wallet;
}

export interface UserListResponse {
  items: User[];
  page: number;
  pageSize: number;
  total: number;
}

export interface UserListParams {
  // Basic pagination
  page?: number;
  size?: number;

  // Search and filter
  search?: string; // Tìm kiếm chung (tên, email)
  email?: string; // Filter theo email chính xác
  fullName?: string; // Filter theo tên
  isActive?: boolean; // Filter theo trạng thái
  roleName?: string; // Filter theo tên vai trò
  roleId?: number; // Filter theo ID vai trò

  // Date range
  createdAtFrom?: string; // Từ ngày (YYYY-MM-DD)
  createdAtTo?: string; // Đến ngày (YYYY-MM-DD)

  // Sorting
  sortBy?: string; // Field để sort
  sortOrder?: 'asc' | 'desc'; // Thứ tự sort

  // Legacy filter (nếu backend vẫn dùng)
  filter?: string;
}

export interface CreateUserBody {
  email: string;
  fullName: string;
  password: string;
  role: Role; // { id, name }
}

export interface UpdateUserBody {
  fullName?: string;
  phoneNumber?: string;
  role?: Role;
  isActive?: boolean;
}

// -------------------- API Services --------------------
export const userService = {
  /** ✅ Get all users với filter nâng cao */
  async getAll(params?: UserListParams): Promise<UserListResponse> {
    // Clean undefined params
    const cleanParams: Record<string, any> = {};
    if (params) {
      Object.keys(params).forEach((key) => {
        if (
          params[key as keyof UserListParams] !== undefined &&
          params[key as keyof UserListParams] !== ''
        ) {
          cleanParams[key] = params[key as keyof UserListParams];
        }
      });
    }

    const response = await jwtAxios.get<UserListResponse>(API_URL, { params: cleanParams });
    return response.data;
  },

  /** ✅ Get user by ID */
  async getById(id: number): Promise<User> {
    const response = await jwtAxios.get<User>(`${API_URL}/${id}`);
    return response.data;
  },

  /** ✅ Create user */
  async create(data: CreateUserBody): Promise<User> {
    const response = await jwtAxios.post<User>(API_URL, data);
    return response.data;
  },

  /** ✅ Update user */
  async update(id: number, data: UpdateUserBody): Promise<User> {
    const response = await jwtAxios.patch<User>(`${API_URL}/${id}`, data);
    return response.data;
  },

  /** ✅ Delete user (hard delete) */
  async delete(id: number): Promise<string> {
    const response = await jwtAxios.delete(`${API_URL}/${id}`);
    if (response.status === 200) return 'User deleted successfully';
    throw new Error('Failed to delete user');
  },

  /** ✅ Soft delete user */
  async softDelete(id: number): Promise<string> {
    const response = await jwtAxios.delete(`${API_URL}/${id}/soft`);
    if (response.status === 200) return 'User deleted successfully';
    throw new Error('Failed to soft delete user');
  },

  /** ✅ Restore user - SỬA LẠI METHOD (thường là PUT/PATCH) */
  async restore(id: number): Promise<string> {
    // Thử với PATCH trước, nếu không được thì thử PUT
    try {
      const response = await jwtAxios.patch(`${API_URL}/${id}/restore`);
      if (response.status === 200) return 'User restored successfully';
    } catch (patchError) {
      // Nếu PATCH không được, thử PUT
      try {
        const response = await jwtAxios.put(`${API_URL}/${id}/restore`);
        if (response.status === 200) return 'User restored successfully';
      } catch (putError) {
        console.error('Both PATCH and PUT failed for restore:', { patchError, putError });
      }
    }
    throw new Error('Failed to restore user');
  },

  /** ✅ Toggle user status (active/inactive) */
  async toggleStatus(id: number, isActive: boolean): Promise<User> {
    const response = await jwtAxios.patch<User>(`${API_URL}/${id}`, { isActive });
    return response.data;
  },

  /** ✅ Change user role */
  async changeRole(id: number, roleId: number): Promise<User> {
    const response = await jwtAxios.patch<User>(`${API_URL}/${id}`, {
      role: { id: roleId },
    });
    return response.data;
  },

  /** ✅ Search users với keyword */
  async search(
    keyword: string,
    params?: Omit<UserListParams, 'search'>,
  ): Promise<UserListResponse> {
    const searchParams: UserListParams = {
      ...params,
      search: keyword,
    };
    return this.getAll(searchParams);
  },

  /** ✅ Get users by role */
  async getByRole(
    roleName: string,
    params?: Omit<UserListParams, 'roleName'>,
  ): Promise<UserListResponse> {
    const roleParams: UserListParams = {
      ...params,
      roleName,
    };
    return this.getAll(roleParams);
  },

  /** ✅ Get users by status */
  async getByStatus(
    isActive: boolean,
    params?: Omit<UserListParams, 'isActive'>,
  ): Promise<UserListResponse> {
    const statusParams: UserListParams = {
      ...params,
      isActive,
    };
    return this.getAll(statusParams);
  },

  /** ✅ Get users created in date range */
  async getByDateRange(
    from: string,
    to: string,
    params?: Omit<UserListParams, 'createdAtFrom' | 'createdAtTo'>,
  ): Promise<UserListResponse> {
    const dateParams: UserListParams = {
      ...params,
      createdAtFrom: from,
      createdAtTo: to,
    };
    return this.getAll(dateParams);
  },
};
