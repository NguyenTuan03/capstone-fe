import { Payment } from '@/types/payment';
import { PaymentStatus } from '@/types/enums';
import { enrollments } from './enrollments';

// Payments - Thanh toán của learners khi enroll vào course
// Mỗi enrollment CONFIRMED hoặc PENDING_PAYMENT có payments
// Platform lấy 20%, Coach nhận 80%

export const payments: Payment[] = [
  // Course 1 enrollments - CONFIRMED
  {
    id: 1,
    bankCode: 'VNPAY',
    amount: 1500000, // pricePerParticipant
    coachEarningTotal: 1200000, // 80%
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240118_001',
    createdAt: new Date('2024-01-18'),
    enrollment: enrollments[0], // Learner 1
  },
  {
    id: 2,
    bankCode: 'MOMO',
    amount: 1500000,
    coachEarningTotal: 1200000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'MOMO_20240118_002',
    createdAt: new Date('2024-01-18'),
    enrollment: enrollments[1], // Learner 2
  },
  {
    id: 3,
    bankCode: 'VNPAY',
    amount: 1500000,
    coachEarningTotal: 1200000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240119_003',
    createdAt: new Date('2024-01-19'),
    enrollment: enrollments[2], // Learner 4
  },
  {
    id: 4,
    bankCode: 'ZALOPAY',
    amount: 1500000,
    coachEarningTotal: 1200000,
    status: PaymentStatus.PENDING,
    createdAt: new Date('2024-01-20'),
    enrollment: enrollments[3], // Learner 6 - PENDING_PAYMENT
  },
  {
    id: 5,
    bankCode: 'VNPAY',
    amount: 1500000,
    coachEarningTotal: 1200000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240122_004',
    createdAt: new Date('2024-01-22'),
    enrollment: enrollments[4], // Learner 11
  },
  {
    id: 6,
    bankCode: 'MOMO',
    amount: 1500000,
    coachEarningTotal: 1200000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'MOMO_20240123_005',
    createdAt: new Date('2024-01-23'),
    enrollment: enrollments[5], // Learner 12
  },
  {
    id: 7,
    bankCode: 'VNPAY',
    amount: 1500000,
    coachEarningTotal: 1200000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240126_006',
    createdAt: new Date('2024-01-26'),
    enrollment: enrollments[7], // Learner 16
  },

  // Course 2 - Individual course - CONFIRMED
  {
    id: 8,
    bankCode: 'VNPAY',
    amount: 3000000,
    coachEarningTotal: 2400000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240112_007',
    createdAt: new Date('2024-01-12'),
    enrollment: enrollments[8], // Learner 10
  },

  // Course 3 enrollments - CONFIRMED
  {
    id: 9,
    bankCode: 'MOMO',
    amount: 1800000,
    coachEarningTotal: 1440000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'MOMO_20240122_008',
    createdAt: new Date('2024-01-22'),
    enrollment: enrollments[9], // Learner 3
  },
  {
    id: 10,
    bankCode: 'VNPAY',
    amount: 1800000,
    coachEarningTotal: 1440000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240123_009',
    createdAt: new Date('2024-01-23'),
    enrollment: enrollments[10], // Learner 5
  },
  {
    id: 11,
    bankCode: 'ZALOPAY',
    amount: 1800000,
    coachEarningTotal: 1440000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'ZALOPAY_20240124_010',
    createdAt: new Date('2024-01-24'),
    enrollment: enrollments[11], // Learner 8
  },
  {
    id: 12,
    bankCode: 'VNPAY',
    amount: 1800000,
    coachEarningTotal: 1440000,
    status: PaymentStatus.PENDING,
    createdAt: new Date('2024-01-24'),
    enrollment: enrollments[12], // Learner 15 - PENDING_PAYMENT
  },
  {
    id: 13,
    bankCode: 'MOMO',
    amount: 1800000,
    coachEarningTotal: 1440000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'MOMO_20240126_011',
    createdAt: new Date('2024-01-26'),
    enrollment: enrollments[13], // Learner 17
  },

  // Course 7 enrollments - CONFIRMED
  {
    id: 14,
    bankCode: 'VNPAY',
    amount: 2000000,
    coachEarningTotal: 1600000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240120_012',
    createdAt: new Date('2024-01-20'),
    enrollment: enrollments[15], // Learner 3
  },
  {
    id: 15,
    bankCode: 'MOMO',
    amount: 2000000,
    coachEarningTotal: 1600000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'MOMO_20240121_013',
    createdAt: new Date('2024-01-21'),
    enrollment: enrollments[16], // Learner 5
  },
  {
    id: 16,
    bankCode: 'VNPAY',
    amount: 2000000,
    coachEarningTotal: 1600000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240122_014',
    createdAt: new Date('2024-01-22'),
    enrollment: enrollments[17], // Learner 8
  },
  {
    id: 17,
    bankCode: 'ZALOPAY',
    amount: 2000000,
    coachEarningTotal: 1600000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'ZALOPAY_20240123_015',
    createdAt: new Date('2024-01-23'),
    enrollment: enrollments[18], // Learner 10
  },
  {
    id: 18,
    bankCode: 'VNPAY',
    amount: 2000000,
    coachEarningTotal: 1600000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240124_016',
    createdAt: new Date('2024-01-24'),
    enrollment: enrollments[19], // Learner 15
  },

  // Course 8 - Individual - CONFIRMED
  {
    id: 19,
    bankCode: 'MOMO',
    amount: 1500000,
    coachEarningTotal: 1200000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'MOMO_20240117_017',
    createdAt: new Date('2024-01-17'),
    enrollment: enrollments[22], // Learner 13
  },

  // Course 9 enrollments - CONFIRMED
  {
    id: 20,
    bankCode: 'VNPAY',
    amount: 2800000,
    coachEarningTotal: 2240000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240124_018',
    createdAt: new Date('2024-01-24'),
    enrollment: enrollments[23], // Learner 10
  },
  {
    id: 21,
    bankCode: 'ZALOPAY',
    amount: 2800000,
    coachEarningTotal: 2240000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'ZALOPAY_20240125_019',
    createdAt: new Date('2024-01-25'),
    enrollment: enrollments[24], // Learner 13
  },
  {
    id: 22,
    bankCode: 'VNPAY',
    amount: 2800000,
    coachEarningTotal: 2240000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240126_020',
    createdAt: new Date('2024-01-26'),
    enrollment: enrollments[25], // Learner 3
  },

  // Course 10 enrollments - CONFIRMED
  {
    id: 23,
    bankCode: 'MOMO',
    amount: 1600000,
    coachEarningTotal: 1280000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'MOMO_20240120_021',
    createdAt: new Date('2024-01-20'),
    enrollment: enrollments[28], // Learner 3
  },
  {
    id: 24,
    bankCode: 'VNPAY',
    amount: 1600000,
    coachEarningTotal: 1280000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240121_022',
    createdAt: new Date('2024-01-21'),
    enrollment: enrollments[29], // Learner 5
  },
  {
    id: 25,
    bankCode: 'ZALOPAY',
    amount: 1600000,
    coachEarningTotal: 1280000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'ZALOPAY_20240122_023',
    createdAt: new Date('2024-01-22'),
    enrollment: enrollments[30], // Learner 8
  },
  {
    id: 26,
    bankCode: 'VNPAY',
    amount: 1600000,
    coachEarningTotal: 1280000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240123_024',
    createdAt: new Date('2024-01-23'),
    enrollment: enrollments[31], // Learner 11
  },
  {
    id: 27,
    bankCode: 'MOMO',
    amount: 1600000,
    coachEarningTotal: 1280000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'MOMO_20240124_025',
    createdAt: new Date('2024-01-24'),
    enrollment: enrollments[32], // Learner 15
  },

  // Course 11 enrollments - CONFIRMED
  {
    id: 28,
    bankCode: 'VNPAY',
    amount: 1000000,
    coachEarningTotal: 800000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240122_026',
    createdAt: new Date('2024-01-22'),
    enrollment: enrollments[34], // Learner 1
  },
  {
    id: 29,
    bankCode: 'MOMO',
    amount: 1000000,
    coachEarningTotal: 800000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'MOMO_20240122_027',
    createdAt: new Date('2024-01-22'),
    enrollment: enrollments[35], // Learner 2
  },
  {
    id: 30,
    bankCode: 'ZALOPAY',
    amount: 1000000,
    coachEarningTotal: 800000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'ZALOPAY_20240123_028',
    createdAt: new Date('2024-01-23'),
    enrollment: enrollments[36], // Learner 4
  },
  {
    id: 31,
    bankCode: 'VNPAY',
    amount: 1000000,
    coachEarningTotal: 800000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240123_029',
    createdAt: new Date('2024-01-23'),
    enrollment: enrollments[37], // Learner 6
  },
  {
    id: 32,
    bankCode: 'MOMO',
    amount: 1000000,
    coachEarningTotal: 800000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'MOMO_20240124_030',
    createdAt: new Date('2024-01-24'),
    enrollment: enrollments[38], // Learner 12
  },
  {
    id: 33,
    bankCode: 'VNPAY',
    amount: 1000000,
    coachEarningTotal: 800000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240124_031',
    createdAt: new Date('2024-01-24'),
    enrollment: enrollments[39], // Learner 14
  },
  {
    id: 34,
    bankCode: 'ZALOPAY',
    amount: 1000000,
    coachEarningTotal: 800000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'ZALOPAY_20240125_032',
    createdAt: new Date('2024-01-25'),
    enrollment: enrollments[40], // Learner 16
  },

  // Course 12 enrollments - CONFIRMED
  {
    id: 35,
    bankCode: 'VNPAY',
    amount: 1200000,
    coachEarningTotal: 960000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240117_033',
    createdAt: new Date('2024-01-17'),
    enrollment: enrollments[44], // Learner 1
  },
  {
    id: 36,
    bankCode: 'MOMO',
    amount: 1200000,
    coachEarningTotal: 960000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'MOMO_20240118_034',
    createdAt: new Date('2024-01-18'),
    enrollment: enrollments[45], // Learner 4
  },
  {
    id: 37,
    bankCode: 'VNPAY',
    amount: 1200000,
    coachEarningTotal: 960000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240119_035',
    createdAt: new Date('2024-01-19'),
    enrollment: enrollments[46], // Learner 6
  },
  {
    id: 38,
    bankCode: 'ZALOPAY',
    amount: 1200000,
    coachEarningTotal: 960000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'ZALOPAY_20240120_036',
    createdAt: new Date('2024-01-20'),
    enrollment: enrollments[47], // Learner 12
  },
  {
    id: 39,
    bankCode: 'VNPAY',
    amount: 1200000,
    coachEarningTotal: 960000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240121_037',
    createdAt: new Date('2024-01-21'),
    enrollment: enrollments[48], // Learner 16
  },
  {
    id: 40,
    bankCode: 'MOMO',
    amount: 1200000,
    coachEarningTotal: 960000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'MOMO_20240123_038',
    createdAt: new Date('2024-01-23'),
    enrollment: enrollments[50], // Learner 14
  },

  // Course 13 - Individual - CONFIRMED
  {
    id: 41,
    bankCode: 'VNPAY',
    amount: 2500000,
    coachEarningTotal: 2000000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'VNPAY_20240125_039',
    createdAt: new Date('2024-01-25'),
    enrollment: enrollments[51], // Learner 10
  },

  // Course 16 - Individual - CONFIRMED
  {
    id: 42,
    bankCode: 'ZALOPAY',
    amount: 2800000,
    coachEarningTotal: 2240000,
    status: PaymentStatus.PAID,
    externalTransactionId: 'ZALOPAY_20240122_040',
    createdAt: new Date('2024-01-22'),
    enrollment: enrollments[61], // Learner 13
  },

  // Some failed payments
  {
    id: 43,
    bankCode: 'VNPAY',
    amount: 1500000,
    coachEarningTotal: 1200000,
    status: PaymentStatus.FAILED,
    externalTransactionId: 'VNPAY_20240120_FAIL',
    createdAt: new Date('2024-01-20'),
    enrollment: enrollments[6], // PENDING_GROUP enrollment
  },
  {
    id: 44,
    bankCode: 'MOMO',
    amount: 2000000,
    coachEarningTotal: 1600000,
    status: PaymentStatus.FAILED,
    createdAt: new Date('2024-01-24'),
    enrollment: enrollments[20], // PENDING_PAYMENT
  },
];

// Helper functions
export const getPaymentById = (id: number): Payment | undefined => {
  return payments.find((payment) => payment.id === id);
};

export const getPaymentsByEnrollmentId = (enrollmentId: number): Payment[] => {
  return payments.filter((payment) => payment.enrollment.id === enrollmentId);
};

export const getPaymentsByUserId = (userId: number): Payment[] => {
  return payments.filter((payment) => payment.enrollment.user.id === userId);
};

export const getPaymentsByStatus = (status: PaymentStatus): Payment[] => {
  return payments.filter((payment) => payment.status === status);
};

export const getPaidPayments = (): Payment[] => {
  return getPaymentsByStatus(PaymentStatus.PAID);
};

export const getPendingPayments = (): Payment[] => {
  return getPaymentsByStatus(PaymentStatus.PENDING);
};

export const getFailedPayments = (): Payment[] => {
  return getPaymentsByStatus(PaymentStatus.FAILED);
};

export const getTotalPaymentAmount = (status?: PaymentStatus): number => {
  const filteredPayments = status
    ? getPaymentsByStatus(status)
    : payments;
  return filteredPayments.reduce((total, payment) => total + payment.amount, 0);
};

export const getTotalPaidAmount = (): number => {
  return getTotalPaymentAmount(PaymentStatus.PAID);
};

export const getTotalPendingAmount = (): number => {
  return getTotalPaymentAmount(PaymentStatus.PENDING);
};

export const getTotalCoachEarningsFromPayments = (): number => {
  return getPaidPayments().reduce(
    (total, payment) => total + payment.coachEarningTotal,
    0,
  );
};

export const getTotalPlatformRevenueFromPayments = (): number => {
  return getPaidPayments().reduce(
    (total, payment) => total + (payment.amount - payment.coachEarningTotal),
    0,
  );
};

// Statistics by payment method
export const getPaymentsByBankCode = (bankCode: string): Payment[] => {
  return payments.filter((payment) => payment.bankCode === bankCode);
};

export const getPaymentMethodStats = () => {
  const bankCodes = ['VNPAY', 'MOMO', 'ZALOPAY'];
  return bankCodes.map((code) => ({
    bankCode: code,
    totalPayments: getPaymentsByBankCode(code).length,
    totalAmount: getPaymentsByBankCode(code)
      .filter((p) => p.status === PaymentStatus.PAID)
      .reduce((sum, p) => sum + p.amount, 0),
  }));
};

