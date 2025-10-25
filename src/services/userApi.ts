import {
  User,
  UserListStats,
  GetUsersParams,
  GetUsersResponse,
  BlockUserRequest,
  ApiResponse,
} from '@/types/user';
import { usersData } from '@/data_admin/users';

// Simulate API delay
const simulateDelay = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms));

export class UserApiService {
  /**
   * Get users with pagination and filters
   */
  static async getUsers(params: GetUsersParams): Promise<GetUsersResponse> {
    await simulateDelay();

    let filteredUsers = [...usersData.users] as User[];

    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.phoneNumber?.toLowerCase().includes(searchTerm),
      );
    }

    // Apply role filter
    if (params.role && params.role !== 'all') {
      filteredUsers = filteredUsers.filter((user) => user.role.name === params.role?.toUpperCase());
    }

    // Apply status filter (using isActive)
    if (params.status && params.status !== 'all') {
      if (params.status === 'active') {
        filteredUsers = filteredUsers.filter((user) => user.isActive);
      } else if (params.status === 'blocked') {
        filteredUsers = filteredUsers.filter((user) => !user.isActive && user.deletedAt);
      } else if (params.status === 'pending') {
        filteredUsers = filteredUsers.filter((user) => !user.isEmailVerified);
      }
    }

    // Skill level filter no longer applies to User entity directly
    // (would need to join with Learner entity)

    // Calculate pagination
    const total = filteredUsers.length;
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      total,
      page: params.page,
      limit: params.limit,
    };
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<User | null> {
    await simulateDelay();

    const user = usersData.users.find((u) => u.id === Number(userId));
    return (user as User) || null;
  }

  /**
   * Get user statistics
   */
  static async getUserStats(): Promise<UserListStats> {
    await simulateDelay();

    const users = usersData.users as User[];

    return {
      total: users.length,
      active: users.filter((u) => u.isActive).length,
      blocked: users.filter((u) => !u.isActive && u.deletedAt).length,
      pending: users.filter((u) => !u.isEmailVerified).length,
      learners: users.filter((u) => u.role.name === 'LEARNER').length,
      coaches: users.filter((u) => u.role.name === 'COACH').length,
    };
  }

  /**
   * Block user with reason
   */
  static async blockUser(request: BlockUserRequest): Promise<ApiResponse> {
    await simulateDelay();

    try {
      // In real app, this would make API call to update user status
      // For mock, we just simulate success

      console.log('Blocking user:', request);

      return {
        success: true,
        message: `Đã khóa tài khoản người dùng thành công`,
        data: {
          userId: request.userId,
          blockedAt: new Date().toISOString(),
          reason: request.reason,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể khóa tài khoản người dùng',
      };
    }
  }

  /**
   * Unblock user
   */
  static async unblockUser(userId: string, adminId: string): Promise<ApiResponse> {
    await simulateDelay();

    try {
      console.log('Unblocking user:', { userId, adminId });

      return {
        success: true,
        message: 'Đã mở khóa tài khoản người dùng thành công',
        data: {
          userId,
          unblockedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể mở khóa tài khoản người dùng',
      };
    }
  }

  /**
   * Delete user (hard delete)
   */
  static async deleteUser(userId: string): Promise<ApiResponse> {
    await simulateDelay();

    try {
      console.log('Deleting user:', userId);

      return {
        success: true,
        message: 'Đã xóa người dùng thành công',
        data: {
          userId,
          deletedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể xóa người dùng',
      };
    }
  }

  /**
   * Get block reason suggestions
   */
  static async getBlockReasons(): Promise<string[]> {
    await simulateDelay(200);

    return usersData.blockReasons;
  }
}
