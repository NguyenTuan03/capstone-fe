import { SessionEarning } from '@/types/session-earning';
import { SessionEarningStatus } from '@/types/enums';
import { sessions } from './sessions';

// Session Earnings - Thu nhập từ các buổi học
// Tính toán: Platform lấy 20% phí, Coach nhận 80%
// sessionPrice = pricePerParticipant * số learners enrolled

export const sessionEarnings: SessionEarning[] = [
  // Course 1 - Session 1 (COMPLETED) - 8 enrollments confirmed * 1,500,000
  {
    id: 1,
    sessionPrice: 12000000, // 8 learners * 1,500,000
    coachEarningTotal: 9600000, // 80% of sessionPrice
    status: SessionEarningStatus.PAID,
    createdAt: new Date('2024-02-01T16:00:00'),
    paidAt: new Date('2024-02-03'),
    session: sessions[0],
  },

  // Course 1 - Session 2 (COMPLETED) - 8 enrollments
  {
    id: 2,
    sessionPrice: 12000000,
    coachEarningTotal: 9600000,
    status: SessionEarningStatus.PAID,
    createdAt: new Date('2024-02-05T16:00:00'),
    paidAt: new Date('2024-02-07'),
    session: sessions[1],
  },

  // Course 1 - Session 3 (IN_PROGRESS) - 8 enrollments
  {
    id: 3,
    sessionPrice: 12000000,
    coachEarningTotal: 9600000,
    status: SessionEarningStatus.PENDING,
    createdAt: new Date('2024-02-08T14:00:00'),
    session: sessions[2],
  },

  // Course 2 - Session 1 (COMPLETED) - 1 enrollment * 3,000,000
  {
    id: 4,
    sessionPrice: 3000000,
    coachEarningTotal: 2400000,
    status: SessionEarningStatus.PAID,
    createdAt: new Date('2024-01-15T11:00:00'),
    paidAt: new Date('2024-01-17'),
    session: sessions[6],
  },

  // Course 2 - Session 2 (COMPLETED)
  {
    id: 5,
    sessionPrice: 3000000,
    coachEarningTotal: 2400000,
    status: SessionEarningStatus.PAID,
    createdAt: new Date('2024-01-18T11:00:00'),
    paidAt: new Date('2024-01-20'),
    session: sessions[7],
  },

  // Course 2 - Session 3 (COMPLETED)
  {
    id: 6,
    sessionPrice: 3000000,
    coachEarningTotal: 2400000,
    status: SessionEarningStatus.PAID,
    createdAt: new Date('2024-01-22T11:00:00'),
    paidAt: new Date('2024-01-24'),
    session: sessions[8],
  },

  // Course 2 - Session 4 (IN_PROGRESS)
  {
    id: 7,
    sessionPrice: 3000000,
    coachEarningTotal: 2400000,
    status: SessionEarningStatus.PENDING,
    createdAt: new Date('2024-01-25T09:00:00'),
    session: sessions[9],
  },

  // Course 8 - Session 1 (COMPLETED) - 1 enrollment * 1,500,000
  {
    id: 8,
    sessionPrice: 1500000,
    coachEarningTotal: 1200000,
    status: SessionEarningStatus.PAID,
    createdAt: new Date('2024-01-22T17:00:00'),
    paidAt: new Date('2024-01-24'),
    session: sessions[26],
  },

  // Course 10 - Session 1 (COMPLETED) - 6 enrollments * 1,600,000
  {
    id: 9,
    sessionPrice: 9600000, // 6 learners * 1,600,000
    coachEarningTotal: 7680000,
    status: SessionEarningStatus.PAID,
    createdAt: new Date('2024-01-25T19:00:00'),
    paidAt: new Date('2024-01-27'),
    session: sessions[36],
  },

  // Course 10 - Session 2 (COMPLETED)
  {
    id: 10,
    sessionPrice: 9600000,
    coachEarningTotal: 7680000,
    status: SessionEarningStatus.PAID,
    createdAt: new Date('2024-02-01T19:00:00'),
    paidAt: new Date('2024-02-03'),
    session: sessions[37],
  },

  // Course 10 - Session 3 (IN_PROGRESS)
  {
    id: 11,
    sessionPrice: 9600000,
    coachEarningTotal: 7680000,
    status: SessionEarningStatus.PENDING,
    createdAt: new Date('2024-02-08T17:00:00'),
    session: sessions[38],
  },

  // Course 12 - Session 1 (COMPLETED) - 7 enrollments * 1,200,000
  {
    id: 12,
    sessionPrice: 8400000, // 7 learners * 1,200,000
    coachEarningTotal: 6720000,
    status: SessionEarningStatus.PAID,
    createdAt: new Date('2024-01-28T09:00:00'),
    paidAt: new Date('2024-01-30'),
    session: sessions[51],
  },

  // Course 12 - Session 2 (COMPLETED)
  {
    id: 13,
    sessionPrice: 8400000,
    coachEarningTotal: 6720000,
    status: SessionEarningStatus.PAID,
    createdAt: new Date('2024-02-04T09:00:00'),
    paidAt: new Date('2024-02-06'),
    session: sessions[52],
  },

  // Course 12 - Session 3 (IN_PROGRESS)
  {
    id: 14,
    sessionPrice: 8400000,
    coachEarningTotal: 6720000,
    status: SessionEarningStatus.PENDING,
    createdAt: new Date('2024-02-11T07:00:00'),
    session: sessions[53],
  },

  // Course 16 - Session 1 (COMPLETED) - 1 enrollment * 2,800,000
  {
    id: 15,
    sessionPrice: 2800000,
    coachEarningTotal: 2240000,
    status: SessionEarningStatus.PAID,
    createdAt: new Date('2024-01-29T15:00:00'),
    paidAt: new Date('2024-01-31'),
    session: sessions[63],
  },

  // Course 16 - Session 2 (COMPLETED)
  {
    id: 16,
    sessionPrice: 2800000,
    coachEarningTotal: 2240000,
    status: SessionEarningStatus.PAID,
    createdAt: new Date('2024-02-05T15:00:00'),
    paidAt: new Date('2024-02-07'),
    session: sessions[64],
  },

  // Course 16 - Session 3 (IN_PROGRESS)
  {
    id: 17,
    sessionPrice: 2800000,
    coachEarningTotal: 2240000,
    status: SessionEarningStatus.PENDING,
    createdAt: new Date('2024-02-12T13:00:00'),
    session: sessions[65],
  },

  // Some cancelled sessions with cancelled earnings
  // Course 4 & 5 (Coach suspended) - Cancelled
  {
    id: 18,
    sessionPrice: 5000000,
    coachEarningTotal: 4000000,
    status: SessionEarningStatus.CANCELLED,
    createdAt: new Date('2024-01-22'),
    session: sessions[0], // Example cancelled session
  },
];

// Helper functions
export const getSessionEarningById = (id: number): SessionEarning | undefined => {
  return sessionEarnings.find((earning) => earning.id === id);
};

export const getSessionEarningsBySessionId = (
  sessionId: number,
): SessionEarning[] => {
  return sessionEarnings.filter((earning) => earning.session.id === sessionId);
};

export const getSessionEarningsByStatus = (
  status: SessionEarningStatus,
): SessionEarning[] => {
  return sessionEarnings.filter((earning) => earning.status === status);
};

export const getPaidEarnings = (): SessionEarning[] => {
  return getSessionEarningsByStatus(SessionEarningStatus.PAID);
};

export const getPendingEarnings = (): SessionEarning[] => {
  return getSessionEarningsByStatus(SessionEarningStatus.PENDING);
};

export const getCancelledEarnings = (): SessionEarning[] => {
  return getSessionEarningsByStatus(SessionEarningStatus.CANCELLED);
};

export const getTotalEarningsByCoachUserId = (coachUserId: number): number => {
  return sessionEarnings
    .filter(
      (earning) =>
        earning.session.course.createdBy.id === coachUserId &&
        earning.status === SessionEarningStatus.PAID,
    )
    .reduce((total, earning) => total + earning.coachEarningTotal, 0);
};

export const getPendingEarningsByCoachUserId = (
  coachUserId: number,
): number => {
  return sessionEarnings
    .filter(
      (earning) =>
        earning.session.course.createdBy.id === coachUserId &&
        earning.status === SessionEarningStatus.PENDING,
    )
    .reduce((total, earning) => total + earning.coachEarningTotal, 0);
};

// Statistics
export const getTotalPlatformRevenue = (): number => {
  return sessionEarnings
    .filter((earning) => earning.status === SessionEarningStatus.PAID)
    .reduce(
      (total, earning) => total + (earning.sessionPrice - earning.coachEarningTotal),
      0,
    );
};

export const getTotalCoachEarnings = (): number => {
  return sessionEarnings
    .filter((earning) => earning.status === SessionEarningStatus.PAID)
    .reduce((total, earning) => total + earning.coachEarningTotal, 0);
};

