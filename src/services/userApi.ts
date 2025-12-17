import {
  User,
  UserListStats,
  GetUsersParams,
  GetUsersResponse,
  BlockUserRequest,
  ApiResponse,
} from '@/types/user';

export class UserApiService {
  /**
   * Get users with pagination and filters
   */
  static async getUsers(_params: GetUsersParams): Promise<GetUsersResponse> {
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get user by ID
   */
  static async getUserById(_userId: string): Promise<User | null> {
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get user statistics
   */
  static async getUserStats(): Promise<UserListStats> {
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Block user with reason
   */
  static async blockUser(_request: BlockUserRequest): Promise<ApiResponse> {
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Unblock user
   */
  static async unblockUser(_userId: string, _adminId: string): Promise<ApiResponse> {
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Delete user (hard delete)
   */
  static async deleteUser(_userId: string): Promise<ApiResponse> {
    throw new Error('Method not implemented. Please implement real API call.');
  }

  /**
   * Get block reason suggestions
   */
  static async getBlockReasons(): Promise<string[]> {
    throw new Error('Method not implemented. Please implement real API call.');
  }
}
