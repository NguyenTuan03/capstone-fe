import jwtAxios from '@/@crema/services/jwt-auth';
import { Wallet } from '@/app/(admin)/wallets/page';

export const getWalletsWithUserInfo = async (): Promise<Wallet[]> => {
  const res = await jwtAxios.get('/wallets/all-with-user-info');
  return res.data;
};
