import { WithdrawalRequestStatus } from './enums';
import { Wallet } from './wallet';
import { WalletTransaction } from './wallet-transaction';

export interface WithdrawalRequest {
  id: number;
  amount: number;
  status: WithdrawalRequestStatus;
  payoutDetails?: string;
  adminComment?: string;
  requestedAt: Date;
  completedAt?: Date;
  wallet: Wallet;
  walletTransactions?: WalletTransaction[];
}

