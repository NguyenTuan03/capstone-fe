// @/services/apis/platform-analysis/index.ts
import { buildUrl } from '@/@crema/helper/BuildUrl';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// -------------------- Interfaces --------------------

// Dashboard Overview Interfaces
export interface TotalUsers {
  total: number;
  percentageChange: number;
}

export interface Coaches {
  total: number;
  percentageChange: number;
  verified: number;
  pending: number;
}

export interface Learners {
  total: number;
  percentageChange: number;
}

export interface Courses {
  total: number;
  completed: number;
  ongoing: number;
  cancelled: number;
}

export interface AverageFeedback {
  total: number;
  percentageChange: number;
}

export interface SystemReports {
  pending: number;
  approved: number;
  rejected: number;
}

export interface CourseStatusChart {
  status: string;
  count: number;
}

export interface FeedbackDistributionChart {
  rating: number;
  count: number;
  percentage: number;
}

export interface DashboardData {
  totalUsers: TotalUsers;
  coaches: Coaches;
  learners: Learners;
  courses: Courses;
  averageFeedback: AverageFeedback;
  systemReports: SystemReports;
  courseStatusChart: CourseStatusChart[];
  feedbackDistributionChart: FeedbackDistributionChart[];
}

export interface DashboardResponse {
  statusCode: number;
  message: string;
  metadata: DashboardData;
}

// Monthly Data Interfaces
export interface MonthlyDataItem {
  month: string;
  data: number;
}

export interface MonthlyDataResponse {
  statusCode: number;
  message: string;
  metadata: {
    data: MonthlyDataItem[];
  };
}

// Filter Parameters
export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
  year?: number;
}

// -------------------------
// Get dashboard overview data
// -------------------------
export const useGetDashboardOverview = (params?: DateRangeParams) => {
  return useQuery({
    queryKey: ['dashboard-overview', params],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const url = buildUrl('platform-analysis/dashboard/overview');
      const response = await axios.get(url, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params,
      });
      return response.data.metadata;
    },
  });
};

// -------------------------
// Get monthly new user registrations
// -------------------------
export const useGetMonthlyNewUsers = (params?: DateRangeParams) => {
  return useQuery({
    queryKey: ['monthly-new-users', params],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const url = buildUrl('platform-analysis/new-users/monthly');
      const response = await axios.get(url, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params,
      });
      console.log(response);

      return response.data.metadata.data;
    },
  });
};

// -------------------------
// Get monthly learner payments
// -------------------------
export const useGetMonthlyLearnerPayments = (params?: DateRangeParams) => {
  return useQuery({
    queryKey: ['monthly-learner-payments', params],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const url = buildUrl('platform-analysis/learner-payments/monthly');
      const response = await axios.get(url, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params,
      });
      return response.data.metadata.data;
    },
  });
};

// -------------------------
// Get monthly coach earnings
// -------------------------
export const useGetMonthlyCoachEarnings = (params?: DateRangeParams) => {
  return useQuery({
    queryKey: ['monthly-coach-earnings', params],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const url = buildUrl('platform-analysis/coach-earnings/monthly');
      const response = await axios.get(url, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params,
      });
      return response.data.metadata.data;
    },
  });
};

// -------------------------
// Get monthly platform revenue
// -------------------------
export const useGetMonthlyPlatformRevenue = (params?: DateRangeParams) => {
  return useQuery({
    queryKey: ['monthly-platform-revenue', params],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const url = buildUrl('platform-analysis/revenue/monthly');
      const response = await axios.get(url, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params,
      });
      return response.data.metadata.data;
    },
  });
};

// -------------------------
// Get all financial data at once
// -------------------------
export const useGetAllFinancialData = (params?: DateRangeParams) => {
  return useQuery({
    queryKey: ['all-financial-data', params],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

      const [newUsers, learnerPayments, coachEarnings, platformRevenue] = await Promise.all([
        axios.get(buildUrl('platform-analysis/new-users/monthly'), {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          params,
        }),
        axios.get(buildUrl('platform-analysis/learner-payments/monthly'), {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          params,
        }),
        axios.get(buildUrl('platform-analysis/coach-earnings/monthly'), {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          params,
        }),
        axios.get(buildUrl('platform-analysis/revenue/monthly'), {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          params,
        }),
      ]);

      return {
        newUsers: newUsers.data.metadata.data,
        learnerPayments: learnerPayments.data.metadata.data,
        coachEarnings: coachEarnings.data.metadata.data,
        platformRevenue: platformRevenue.data.metadata.data,
      };
    },
  });
};

// -------------------- Helper Functions --------------------

/**
 * ✅ Format currency
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(value);
};

/**
 * ✅ Format number
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

/**
 * ✅ Calculate percentage change
 */
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * ✅ Get current and previous month data
 */
export const getCurrentAndPreviousMonthData = (data: MonthlyDataItem[]) => {
  if (data.length < 2) return { current: 0, previous: 0 };

  const currentMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];

  return {
    current: currentMonth?.data || 0,
    previous: previousMonth?.data || 0,
  };
};
