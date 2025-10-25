import { User } from './user';
import { WalletTransaction } from './wallet-transaction';
import { WithdrawalRequest } from './withdrawal-request';

export interface Wallet {
  id: number;
  currentBalance: number;
  totalIncome: number;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  transactions?: WalletTransaction[];
  withdrawalRequests?: WithdrawalRequest[];
}

