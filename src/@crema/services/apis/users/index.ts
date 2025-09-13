import { UpdateUserData, CreateUserData, User } from '@/@crema/types/models/User';
import { useBaseApiHooks } from '../BaseApi';

export const UserApi = () => {
  return useBaseApiHooks<User, CreateUserData, UpdateUserData>('/users');
};
