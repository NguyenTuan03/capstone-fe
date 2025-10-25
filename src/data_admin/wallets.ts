import { Wallet } from '@/types/wallet';
import { users } from './users';

// Wallets - Mỗi coach có 1 wallet để nhận thu nhập
// Chỉ coaches có wallet, learners không cần
export const wallets: Wallet[] = [
  // Coach 1 (Nguyễn Văn Minh - user id 2)
  {
    id: 1,
    currentBalance: 15360000, // Còn lại sau khi rút tiền
    totalIncome: 19200000, // 2 sessions paid * 9,600,000
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-07'),
    user: users[1],
  },

  // Coach 2 (Trần Thị Hương - user id 3)
  {
    id: 2,
    currentBalance: 0,
    totalIncome: 0, // Course chưa có session completed
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    user: users[2],
  },

  // Coach 3 (Lê Văn Cường - user id 4) - SUSPENDED
  {
    id: 3,
    currentBalance: 0,
    totalIncome: 0, // Courses cancelled
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-22'),
    user: users[3],
  },

  // Coach 4 (Phạm Thị Mai - user id 5) - PENDING
  {
    id: 4,
    currentBalance: 0,
    totalIncome: 0,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    user: users[4],
  },

  // Coach 5 (Hoàng Văn Đức - user id 6)
  {
    id: 5,
    currentBalance: 1200000,
    totalIncome: 1200000, // 1 session paid
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-24'),
    user: users[5],
  },

  // Coach 6 (Vũ Thị Lan - user id 7)
  {
    id: 6,
    currentBalance: 15360000,
    totalIncome: 15360000, // 2 sessions paid * 7,680,000
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-02-03'),
    user: users[6],
  },

  // Coach 7 (Đỗ Văn Thành - user id 8)
  {
    id: 7,
    currentBalance: 10000000, // Đã rút 3,440,000
    totalIncome: 13440000, // 2 sessions paid * 6,720,000
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-08'),
    user: users[7],
  },

  // Coach 8 (Bùi Thị Nga - user id 9)
  {
    id: 8,
    currentBalance: 0,
    totalIncome: 0, // Course starts 2024-02-15
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-23'),
    user: users[8],
  },

  // Coach 9 (Ngô Văn Hải - user id 10)
  {
    id: 9,
    currentBalance: 0,
    totalIncome: 0, // Course starts 2024-02-18
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24'),
    user: users[9],
  },

  // Coach 10 (Đinh Thị Phương - user id 11)
  {
    id: 10,
    currentBalance: 4480000,
    totalIncome: 4480000, // 2 sessions paid * 2,240,000
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-07'),
    user: users[10],
  },

  // Coach 11 (Lý Văn Tài - user id 12)
  {
    id: 11,
    currentBalance: 0,
    totalIncome: 0, // Course starts 2024-02-22
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    user: users[11],
  },

  // Coach 12 (Cao Thị Tâm - user id 13)
  {
    id: 12,
    currentBalance: 0,
    totalIncome: 0, // Course starts 2024-02-25
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    user: users[12],
  },
];

// Helper functions
export const getWalletById = (id: number): Wallet | undefined => {
  return wallets.find((wallet) => wallet.id === id);
};

export const getWalletByUserId = (userId: number): Wallet | undefined => {
  return wallets.find((wallet) => wallet.user.id === userId);
};

export const getTotalPlatformBalance = (): number => {
  return wallets.reduce((total, wallet) => total + wallet.currentBalance, 0);
};

export const getTotalCoachIncome = (): number => {
  return wallets.reduce((total, wallet) => total + wallet.totalIncome, 0);
};

export const getActiveWallets = (): Wallet[] => {
  return wallets.filter((wallet) => wallet.totalIncome > 0);
};

