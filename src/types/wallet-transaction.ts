import { WalletTransactionType } from './enums';
import { Wallet } from './wallet';
import { Session } from './session';
import { WithdrawalRequest } from './withdrawal-request';

export interface WalletTransaction {
  id: number;
  amount: number;
  description?: string;
  type: WalletTransactionType;
  createdAt: Date;
  wallet: Wallet;
  session?: Session;
  withdrawalRequest?: WithdrawalRequest;
}

