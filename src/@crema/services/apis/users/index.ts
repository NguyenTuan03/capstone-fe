import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserList } from './getUser';
import { createUser } from './createUser';

interface UserListParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

// Custom Hook - Get Users List
export const useGetUserList = (params: UserListParams) => {
  return useQuery({
    queryKey: ['users', 'list', params],
    queryFn: () => getUserList.getUsers(params),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Custom Hook - Create User
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createUser.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
    },
  });
};
