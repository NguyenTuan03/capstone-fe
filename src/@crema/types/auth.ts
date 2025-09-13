import { RoleEnum } from '../constants/AppEnums';

export interface UserType {
  id: string;
  email: string;
  fullName: string;
  role: {
    id: string;
    name: RoleEnum;
  };
}
