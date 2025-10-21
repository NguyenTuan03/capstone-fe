import axios from 'axios';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'LEARNER' | 'COACH' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  skillLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  createdAt: string;
  updatedAt: string;
}

interface UserListParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

// API Service - Get List Only
export const getUserList = {
  getUsers: async (params: UserListParams): Promise<User[]> => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/users', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error}`);
    }
  },
};
