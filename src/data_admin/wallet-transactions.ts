import { WalletTransaction } from '@/types/wallet-transaction';
import { WalletTransactionType } from '@/types/enums';
import { wallets } from './wallets';
import { sessions } from './sessions';

// Wallet Transactions - Lịch sử giao dịch trong ví
// Bao gồm thu nhập từ sessions và rút tiền
export const walletTransactions: WalletTransaction[] = [
  // Coach 1 (Nguyễn Văn Minh) - Wallet 1
  // Session 1 earnings
  {
    id: 1,
    amount: 9600000,
    description: 'Thu nhập từ buổi học: Pickleball Cơ Bản - Session 1',
    type: WalletTransactionType.EARNING,
    createdAt: new Date('2024-02-03'),
    wallet: wallets[0],
    session: sessions[0],
  },
  // Session 2 earnings
  {
    id: 2,
    amount: 9600000,
    description: 'Thu nhập từ buổi học: Pickleball Cơ Bản - Session 2',
    type: WalletTransactionType.EARNING,
    createdAt: new Date('2024-02-07'),
    wallet: wallets[0],
    session: sessions[1],
  },
  // Withdrawal
  {
    id: 3,
    amount: -3840000, // Negative for withdrawal
    description: 'Rút tiền về tài khoản ngân hàng',
    type: WalletTransactionType.WITHDRAWAL,
    createdAt: new Date('2024-02-08'),
    wallet: wallets[0],
  },

  // Coach 1 - Advanced course (Course 2) - Sessions 7, 8, 9
  {
    id: 4,
    amount: 2400000,
    description: 'Thu nhập từ buổi học: Chiến Thuật Nâng Cao - Session 1',
    type: WalletTransactionType.EARNING,
    createdAt: new Date('2024-01-17'),
    wallet: wallets[0],
    session: sessions[6],
  },
  {
    id: 5,
    amount: 2400000,
    description: 'Thu nhập từ buổi học: Chiến Thuật Nâng Cao - Session 2',
    type: WalletTransactionType.EARNING,
    createdAt: new Date('2024-01-20'),
    wallet: wallets[0],
    session: sessions[7],
  },
  {
    id: 6,
    amount: 2400000,
    description: 'Thu nhập từ buổi học: Chiến Thuật Nâng Cao - Session 3',
    type: WalletTransactionType.EARNING,
    createdAt: new Date('2024-01-24'),
    wallet: wallets[0],
    session: sessions[8],
  },

  // Coach 5 (Hoàng Văn Đức) - Wallet 5
  {
    id: 7,
    amount: 1200000,
    description: 'Thu nhập từ buổi học: Dinh Dưỡng Thể Thao - Session 1',
    type: WalletTransactionType.EARNING,
    createdAt: new Date('2024-01-24'),
    wallet: wallets[4],
    session: sessions[26],
  },

  // Coach 6 (Vũ Thị Lan) - Wallet 6
  {
    id: 8,
    amount: 7680000,
    description: 'Thu nhập từ buổi học: Giao Tiếp Trong Thi Đấu Đôi - Session 1',
    type: WalletTransactionType.EARNING,
    createdAt: new Date('2024-01-27'),
    wallet: wallets[5],
    session: sessions[36],
  },
  {
    id: 9,
    amount: 7680000,
    description: 'Thu nhập từ buổi học: Giao Tiếp Trong Thi Đấu Đôi - Session 2',
    type: WalletTransactionType.EARNING,
    createdAt: new Date('2024-02-03'),
    wallet: wallets[5],
    session: sessions[37],
  },

  // Coach 7 (Đỗ Văn Thành) - Wallet 7
  {
    id: 10,
    amount: 6720000,
    description: 'Thu nhập từ buổi học: Người Cao Tuổi - Session 1',
    type: WalletTransactionType.EARNING,
    createdAt: new Date('2024-01-30'),
    wallet: wallets[6],
    session: sessions[51],
  },
  {
    id: 11,
    amount: 6720000,
    description: 'Thu nhập từ buổi học: Người Cao Tuổi - Session 2',
    type: WalletTransactionType.EARNING,
    createdAt: new Date('2024-02-06'),
    wallet: wallets[6],
    session: sessions[52],
  },
  // Withdrawal
  {
    id: 12,
    amount: -3440000,
    description: 'Rút tiền về tài khoản ngân hàng',
    type: WalletTransactionType.WITHDRAWAL,
    createdAt: new Date('2024-02-08'),
    wallet: wallets[6],
  },

  // Coach 10 (Đinh Thị Phương) - Wallet 10
  {
    id: 13,
    amount: 2240000,
    description: 'Thu nhập từ buổi học: Dink Game - Session 1',
    type: WalletTransactionType.EARNING,
    createdAt: new Date('2024-01-31'),
    wallet: wallets[9],
    session: sessions[63],
  },
  {
    id: 14,
    amount: 2240000,
    description: 'Thu nhập từ buổi học: Dink Game - Session 2',
    type: WalletTransactionType.EARNING,
    createdAt: new Date('2024-02-07'),
    wallet: wallets[9],
    session: sessions[64],
  },

  // Platform commission transactions (20% from each session)
  // These could be tracked separately or as negative transactions
  {
    id: 15,
    amount: -2400000, // 20% of 12,000,000
    description: 'Hoa hồng Platform 20%',
    type: WalletTransactionType.COMMISSION,
    createdAt: new Date('2024-02-03'),
    wallet: wallets[0],
    session: sessions[0],
  },
  {
    id: 16,
    amount: -2400000,
    description: 'Hoa hồng Platform 20%',
    type: WalletTransactionType.COMMISSION,
    createdAt: new Date('2024-02-07'),
    wallet: wallets[0],
    session: sessions[1],
  },
];

// Helper functions
export const getTransactionById = (id: number): WalletTransaction | undefined => {
  return walletTransactions.find((transaction) => transaction.id === id);
};

export const getTransactionsByWalletId = (
  walletId: number,
): WalletTransaction[] => {
  return walletTransactions.filter(
    (transaction) => transaction.wallet.id === walletId,
  );
};

export const getTransactionsByUserId = (
  userId: number,
): WalletTransaction[] => {
  return walletTransactions.filter(
    (transaction) => transaction.wallet.user.id === userId,
  );
};

export const getTransactionsByType = (
  type: WalletTransactionType,
): WalletTransaction[] => {
  return walletTransactions.filter((transaction) => transaction.type === type);
};

export const getEarningTransactions = (): WalletTransaction[] => {
  return getTransactionsByType(WalletTransactionType.EARNING);
};

export const getWithdrawalTransactions = (): WalletTransaction[] => {
  return getTransactionsByType(WalletTransactionType.WITHDRAWAL);
};

export const getTotalEarnings = (): number => {
  return walletTransactions
    .filter((t) => t.type === WalletTransactionType.EARNING)
    .reduce((total, t) => total + t.amount, 0);
};

export const getTotalWithdrawals = (): number => {
  return Math.abs(
    walletTransactions
      .filter((t) => t.type === WalletTransactionType.WITHDRAWAL)
      .reduce((total, t) => total + t.amount, 0),
  );
};

export const getTotalCommissions = (): number => {
  return Math.abs(
    walletTransactions
      .filter((t) => t.type === WalletTransactionType.COMMISSION)
      .reduce((total, t) => total + t.amount, 0),
  );
};

