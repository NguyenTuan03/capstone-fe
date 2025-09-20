import { GetUsersParams, GetUsersResponse, UserDetail, UserApiResponse, UserListStats } from '@/types/user';
import usersData from '@/data/users.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class UserApiService {
  private static users: UserDetail[] = usersData.users as UserDetail[];
  private static stats: UserListStats = usersData.stats as UserListStats;

  // Get all users with pagination and filters
  static async getUsers(params: GetUsersParams = {}): Promise<GetUsersResponse> {
    await delay(800); // Simulate API call delay

    const {
      page = 1,
      limit = 10,
      search = '',
      role = 'all',
      status = 'all',
      skillLevel = 'all'
    } = params;

    let filteredUsers = [...this.users];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.includes(search)
      );
    }

    // Apply role filter
    if (role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    // Apply status filter
    if (status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    // Apply skill level filter
    if (skillLevel !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.skillLevel === skillLevel);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      total: filteredUsers.length,
      page,
      limit,
      totalPages: Math.ceil(filteredUsers.length / limit)
    };
  }

  // Get user by ID
  static async getUserById(id: string): Promise<UserDetail | null> {
    await delay(500);
    
    const user = this.users.find(u => u.id === id);
    return user || null;
  }

  // Get all users data (for admin overview)
  static async getAllUsersData(): Promise<UserApiResponse> {
    await delay(600);
    
    return {
      users: this.users,
      filters: usersData.filters as any,
      stats: this.stats
    };
  }

  // Update user role
  static async updateUserRole(userId: string, newRole: 'user' | 'coach' | 'admin'): Promise<UserDetail> {
    await delay(1000);
    
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      role: newRole,
      status: newRole === 'coach' ? 'active' : this.users[userIndex].status
    };

    // If promoting to coach, update coach profile
    if (newRole === 'coach' && this.users[userIndex].coachApplication) {
      this.users[userIndex].coachProfile = {
        isVerified: true,
        verifiedAt: new Date().toISOString(),
        certifications: [],
        specialties: this.users[userIndex].coachApplication!.requestedSpecialties,
        experience: 0,
        hourlyRate: this.users[userIndex].coachApplication!.requestedRate,
        rating: 0,
        totalSessions: 0,
        bio: this.users[userIndex].coachApplication!.motivation
      };
    }

    return this.users[userIndex];
  }

  // Update user status
  static async updateUserStatus(userId: string, status: 'active' | 'banned', reason?: string): Promise<UserDetail> {
    await delay(800);
    
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      status,
      ...(status === 'banned' && {
        banReason: reason,
        bannedAt: new Date().toISOString(),
        bannedBy: 'current_admin' // Should be replaced with actual admin ID
      })
    };

    return this.users[userIndex];
  }

  // Delete user
  static async deleteUser(userId: string): Promise<void> {
    await delay(600);
    
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users.splice(userIndex, 1);
    
    // Update stats
    this.stats.total -= 1;
  }

  // Create new user
  static async createUser(userData: Partial<UserDetail>): Promise<UserDetail> {
    await delay(1200);
    
    const newUser: UserDetail = {
      id: `usr_${Date.now()}`,
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
      role: userData.role || 'user',
      status: 'active',
      location: userData.location || '',
      joinDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      skillLevel: userData.skillLevel || 'beginner',
      activityHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          action: 'Tài khoản được tạo bởi admin',
          type: 'admin_action'
        }
      ],
      stats: {
        lessonsCompleted: 0,
        sessionsBooked: 0,
        videosUploaded: 0,
        totalTimeSpent: 0
      }
    };

    this.users.unshift(newUser);
    this.stats.total += 1;
    
    return newUser;
  }

  // Update user profile
  static async updateUser(userId: string, userData: Partial<UserDetail>): Promise<UserDetail> {
    await delay(900);
    
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
      id: userId // Ensure ID doesn't change
    };

    return this.users[userIndex];
  }

  // Get user statistics
  static async getUserStats(): Promise<UserListStats> {
    await delay(400);
    
    // Recalculate stats from current users
    const stats: UserListStats = {
      total: this.users.length,
      active: this.users.filter(u => u.status === 'active').length,
      banned: this.users.filter(u => u.status === 'banned').length,
      pendingApproval: this.users.filter(u => u.status === 'pending_coach_approval').length,
      users: this.users.filter(u => u.role === 'user').length,
      coaches: this.users.filter(u => u.role === 'coach').length,
      admins: this.users.filter(u => u.role === 'admin').length
    };
    
    return stats;
  }
}
