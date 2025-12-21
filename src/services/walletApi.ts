export const approveWithdrawalRequest = async (id: number) => {
  const res = await jwtAxios.patch(`/wallets/withdrawal/${id}/approve`);
  return res.data;
};

export const rejectWithdrawalRequest = async (id: number) => {
  const res = await jwtAxios.patch(`/wallets/withdrawal/${id}/reject`);
  return res.data;
};
import jwtAxios from '@/@crema/services/jwt-auth';
import { Wallet } from '@/app/(admin)/wallets/page';

export const getWalletsWithUserInfo = async (): Promise<Wallet[]> => {
  const res = await jwtAxios.get('/wallets/all-with-user-info');
  return res.data;
};
