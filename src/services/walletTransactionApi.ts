import jwtAxios from '@/@crema/services/jwt-auth';
import { WalletTransaction } from '@/types/wallet-transaction';

export const getWalletTransactionsByWalletId = async (
  walletId: number,
): Promise<WalletTransaction[]> => {
  const res = await jwtAxios.get(`/wallets/${walletId}/transactions`);
  return res.data;
};
