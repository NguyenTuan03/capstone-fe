import { Role } from '@/types/role';
import { RoleName } from '@/types/enums';

export const roles: Role[] = [
  {
    id: 1,
    name: RoleName.ADMIN,
  },
  {
    id: 2,
    name: RoleName.COACH,
  },
  {
    id: 3,
    name: RoleName.LEARNER,
  },
];

// Helper functions
export const getRoleById = (id: number): Role | undefined => {
  return roles.find((role) => role.id === id);
};

export const getRoleByName = (name: RoleName): Role | undefined => {
  return roles.find((role) => role.name === name);
};

