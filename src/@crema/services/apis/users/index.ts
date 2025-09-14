import { UpdateUserData, CreateUserData, User } from '@/@crema/types/models/User';
import { useBaseApiHooks } from '../BaseApi';
import { BaseApiENUM } from '@/@crema/constants/AppEnums';

export const UserApi = () => {
  return useBaseApiHooks<User, CreateUserData, UpdateUserData>(`${BaseApiENUM.BASE_API}/users`);
};
