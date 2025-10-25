import { WithdrawalRequest } from '@/types/withdrawal-request';
import { WithdrawalRequestStatus } from '@/types/enums';
import { wallets } from './wallets';

// Withdrawal Requests - Yêu cầu rút tiền của coaches
export const withdrawalRequests: WithdrawalRequest[] = [
  // Coach 1 (Nguyễn Văn Minh) - Approved and completed
  {
    id: 1,
    amount: 3840000,
    status: WithdrawalRequestStatus.COMPLETED,
    payoutDetails: JSON.stringify({
      bankName: 'Vietcombank',
      accountNumber: '1234567890',
      accountName: 'NGUYEN VAN MINH',
    }),
    adminComment: 'Đã chuyển khoản thành công',
    requestedAt: new Date('2024-02-07T10:00:00'),
    completedAt: new Date('2024-02-08'),
    wallet: wallets[0],
  },

  // Coach 7 (Đỗ Văn Thành) - Approved and completed
  {
    id: 2,
    amount: 3440000,
    status: WithdrawalRequestStatus.COMPLETED,
    payoutDetails: JSON.stringify({
      bankName: 'Techcombank',
      accountNumber: '9876543210',
      accountName: 'DO VAN THANH',
    }),
    adminComment: 'Đã chuyển khoản thành công',
    requestedAt: new Date('2024-02-07T14:00:00'),
    completedAt: new Date('2024-02-08'),
    wallet: wallets[6],
  },

  // Coach 6 (Vũ Thị Lan) - Pending approval
  {
    id: 3,
    amount: 5000000,
    status: WithdrawalRequestStatus.PENDING,
    payoutDetails: JSON.stringify({
      bankName: 'ACB',
      accountNumber: '5555666677',
      accountName: 'VU THI LAN',
    }),
    requestedAt: new Date('2024-02-10T09:00:00'),
    wallet: wallets[5],
  },

  // Coach 5 (Hoàng Văn Đức) - Approved, waiting to complete
  {
    id: 4,
    amount: 800000,
    status: WithdrawalRequestStatus.APPROVED,
    payoutDetails: JSON.stringify({
      bankName: 'VPBank',
      accountNumber: '1111222233',
      accountName: 'HOANG VAN DUC',
    }),
    adminComment: 'Đã duyệt, sẽ chuyển khoản trong 24h',
    requestedAt: new Date('2024-02-09T15:00:00'),
    wallet: wallets[4],
  },

  // Coach 10 (Đinh Thị Phương) - Rejected (amount too small)
  {
    id: 5,
    amount: 500000,
    status: WithdrawalRequestStatus.REJECTED,
    payoutDetails: JSON.stringify({
      bankName: 'MBBank',
      accountNumber: '8888999900',
      accountName: 'DINH THI PHUONG',
    }),
    adminComment: 'Số tiền rút tối thiểu là 1,000,000 VNĐ',
    requestedAt: new Date('2024-02-08T11:00:00'),
    completedAt: new Date('2024-02-08'),
    wallet: wallets[9],
  },

  // Coach 1 - Another pending request
  {
    id: 6,
    amount: 5000000,
    status: WithdrawalRequestStatus.PENDING,
    payoutDetails: JSON.stringify({
      bankName: 'Vietcombank',
      accountNumber: '1234567890',
      accountName: 'NGUYEN VAN MINH',
    }),
    requestedAt: new Date('2024-02-11T10:00:00'),
    wallet: wallets[0],
  },

  // Coach 6 - Previous approved request
  {
    id: 7,
    amount: 3000000,
    status: WithdrawalRequestStatus.COMPLETED,
    payoutDetails: JSON.stringify({
      bankName: 'ACB',
      accountNumber: '5555666677',
      accountName: 'VU THI LAN',
    }),
    adminComment: 'Đã chuyển khoản thành công',
    requestedAt: new Date('2024-02-04T14:00:00'),
    completedAt: new Date('2024-02-05'),
    wallet: wallets[5],
  },
];

// Helper functions
export const getWithdrawalRequestById = (
  id: number,
): WithdrawalRequest | undefined => {
  return withdrawalRequests.find((request) => request.id === id);
};

export const getWithdrawalRequestsByWalletId = (
  walletId: number,
): WithdrawalRequest[] => {
  return withdrawalRequests.filter((request) => request.wallet.id === walletId);
};

export const getWithdrawalRequestsByUserId = (
  userId: number,
): WithdrawalRequest[] => {
  return withdrawalRequests.filter(
    (request) => request.wallet.user.id === userId,
  );
};

export const getWithdrawalRequestsByStatus = (
  status: WithdrawalRequestStatus,
): WithdrawalRequest[] => {
  return withdrawalRequests.filter((request) => request.status === status);
};

export const getPendingWithdrawalRequests = (): WithdrawalRequest[] => {
  return getWithdrawalRequestsByStatus(WithdrawalRequestStatus.PENDING);
};

export const getApprovedWithdrawalRequests = (): WithdrawalRequest[] => {
  return getWithdrawalRequestsByStatus(WithdrawalRequestStatus.APPROVED);
};

export const getCompletedWithdrawalRequests = (): WithdrawalRequest[] => {
  return getWithdrawalRequestsByStatus(WithdrawalRequestStatus.COMPLETED);
};

export const getRejectedWithdrawalRequests = (): WithdrawalRequest[] => {
  return getWithdrawalRequestsByStatus(WithdrawalRequestStatus.REJECTED);
};

export const getTotalWithdrawalAmount = (
  status?: WithdrawalRequestStatus,
): number => {
  const requests = status
    ? getWithdrawalRequestsByStatus(status)
    : withdrawalRequests;
  return requests.reduce((total, request) => total + request.amount, 0);
};

export const getTotalPendingWithdrawalAmount = (): number => {
  return getTotalWithdrawalAmount(WithdrawalRequestStatus.PENDING);
};

export const getTotalCompletedWithdrawalAmount = (): number => {
  return getTotalWithdrawalAmount(WithdrawalRequestStatus.COMPLETED);
};

