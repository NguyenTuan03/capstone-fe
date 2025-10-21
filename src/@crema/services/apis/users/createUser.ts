import { User } from '@/@crema/types/models/User';
import axios from 'axios';

interface CreateUserData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  profilePicture: string;
  isActive: boolean;
  roleId: string;
}

// API Service - Create User
export const createUser = {
  createUser: async (data: CreateUserData): Promise<User> => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/users', data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  },
};
