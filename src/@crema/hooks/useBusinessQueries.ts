// Specialized hooks for Pickle Ball Management System business logic
import { RoleEnum } from '../constants/AppEnums';
import {
  useCrudOperations,
  usePaginatedQuery,
  useSearchQuery,
  useFormMutation,
} from './useApiQuery';

// ================================
// TYPE DEFINITIONS
// ================================

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: {
    id: number;
    name: RoleEnum;
  };
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Court {
  id: number;
  name: string;
  description?: string;
  pricePerHour: number;
  status: 'available' | 'maintenance' | 'unavailable';
  capacity: number;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: number;
  userId: number;
  courtId: number;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  court?: Court;
}

export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  method: 'cash' | 'bank_transfer' | 'credit_card' | 'e_wallet';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: string;
  booking?: Booking;
}

// ================================
// USER OPERATIONS
// ================================

export const useUserOperations = () => {
  return useCrudOperations<User, Omit<User, 'id' | 'createdAt' | 'updatedAt'>, Partial<User>>(
    'users',
  );
};

export const useUserSearch = (searchTerm: string) => {
  return useSearchQuery<{ users: User[]; total: number }>('/users/search', searchTerm);
};

export const useUsersByRole = (role: User['role']) => {
  return usePaginatedQuery<{ users: User[]; total: number }>('/users', {
    params: { role },
  });
};

// ================================
// COURT OPERATIONS
// ================================

export const useCourtOperations = () => {
  return useCrudOperations<Court, Omit<Court, 'id' | 'createdAt' | 'updatedAt'>, Partial<Court>>(
    'courts',
  );
};

export const useAvailableCourts = (date?: string, startTime?: string, endTime?: string) => {
  return usePaginatedQuery<{ courts: Court[]; total: number }>('/courts/available', {
    params: { date, startTime, endTime },
    queryOptions: {
      enabled: !!date,
      staleTime: 2 * 60 * 1000, // 2 minutes for availability data
    },
  });
};

export const useCourtSchedule = (courtId: number, date: string) => {
  return usePaginatedQuery<{ bookings: Booking[] }>(`/courts/${courtId}/schedule`, {
    params: { date },
    queryOptions: {
      enabled: !!courtId && !!date,
      staleTime: 1 * 60 * 1000, // 1 minute for schedule data
    },
  });
};

// ================================
// BOOKING OPERATIONS
// ================================

export const useBookingOperations = () => {
  const baseCrud = useCrudOperations<
    Booking,
    Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>,
    Partial<Booking>
  >('bookings');

  // Confirm booking
  const useConfirmBooking = () => {
    return useFormMutation<Booking, { id: number }>('/bookings/confirm', {
      method: 'POST',
      successMessage: 'Xác nhận đặt sân thành công!',
    });
  };

  // Cancel booking
  const useCancelBooking = () => {
    return useFormMutation<Booking, { id: number; reason?: string }>('/bookings/cancel', {
      method: 'POST',
      successMessage: 'Hủy đặt sân thành công!',
    });
  };

  // Check availability
  const useCheckAvailability = () => {
    return useFormMutation<
      { available: boolean; conflicts?: Booking[] },
      {
        courtId: number;
        startTime: string;
        endTime: string;
      }
    >('/bookings/check-availability', {
      method: 'POST',
      showSuccessMessage: false,
    });
  };

  return {
    ...baseCrud,
    useConfirmBooking,
    useCancelBooking,
    useCheckAvailability,
  };
};

export const useBookingsByUser = (userId: number) => {
  return usePaginatedQuery<{ bookings: Booking[]; total: number }>('/bookings', {
    params: { userId },
    queryOptions: {
      enabled: !!userId,
    },
  });
};

export const useBookingsByStatus = (status: Booking['status']) => {
  return usePaginatedQuery<{ bookings: Booking[]; total: number }>('/bookings', {
    params: { status },
  });
};

export const useTodaysBookings = () => {
  const today = new Date().toISOString().split('T')[0];
  return usePaginatedQuery<{ bookings: Booking[]; total: number }>('/bookings/by-date', {
    params: { date: today },
    queryOptions: {
      refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes for today's bookings
    },
  });
};

// ================================
// PAYMENT OPERATIONS
// ================================

export const usePaymentOperations = () => {
  const baseCrud = useCrudOperations<Payment, Omit<Payment, 'id' | 'createdAt'>, Partial<Payment>>(
    'payments',
  );

  // Process payment
  const useProcessPayment = () => {
    return useFormMutation<
      Payment,
      {
        bookingId: number;
        amount: number;
        method: Payment['method'];
        transactionId?: string;
      }
    >('/payments/process', {
      method: 'POST',
      successMessage: 'Thanh toán thành công!',
    });
  };

  // Refund payment
  const useRefundPayment = () => {
    return useFormMutation<
      Payment,
      {
        paymentId: number;
        reason?: string;
      }
    >('/payments/refund', {
      method: 'POST',
      successMessage: 'Hoàn tiền thành công!',
    });
  };

  return {
    ...baseCrud,
    useProcessPayment,
    useRefundPayment,
  };
};

export const usePaymentsByBooking = (bookingId: number) => {
  return usePaginatedQuery<{ payments: Payment[]; total: number }>('/payments', {
    params: { bookingId },
    queryOptions: {
      enabled: !!bookingId,
    },
  });
};

// ================================
// DASHBOARD & ANALYTICS
// ================================

export const useDashboardStats = () => {
  return usePaginatedQuery<{
    totalRevenue: number;
    totalBookings: number;
    activeUsers: number;
    courtUtilization: number;
    recentBookings: Booking[];
    popularCourts: Array<{ court: Court; bookingCount: number }>;
  }>('/dashboard/stats', {
    queryOptions: {
      staleTime: 5 * 60 * 1000, // 5 minutes for dashboard stats
      refetchInterval: 5 * 60 * 1000, // Auto refresh every 5 minutes
    },
  });
};

export const useRevenueAnalytics = (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
  return usePaginatedQuery<{
    revenue: Array<{ date: string; amount: number }>;
    totalRevenue: number;
    growth: number;
  }>('/analytics/revenue', {
    params: { period },
    queryOptions: {
      staleTime: 10 * 60 * 1000, // 10 minutes for analytics
    },
  });
};

export const useCourtUtilization = (startDate: string, endDate: string) => {
  return usePaginatedQuery<{
    courts: Array<{
      court: Court;
      totalHours: number;
      bookedHours: number;
      utilizationRate: number;
    }>;
  }>('/analytics/court-utilization', {
    params: { startDate, endDate },
    queryOptions: {
      enabled: !!startDate && !!endDate,
      staleTime: 15 * 60 * 1000, // 15 minutes for utilization data
    },
  });
};

// ================================
// UTILITY HOOKS
// ================================

// Real-time booking updates (for admin dashboard)
export const useRealtimeBookings = () => {
  return useTodaysBookings();
};

// Get current user's bookings
export const useMyBookings = () => {
  // This should get current user ID from auth context
  // For now, using a placeholder
  const currentUserId = 1; // Replace with actual auth hook
  return useBookingsByUser(currentUserId);
};

// Check if court is available for booking
export const useCourtAvailabilityCheck = (
  courtId: number,
  date: string,
  startTime: string,
  endTime: string,
) => {
  const { useCheckAvailability } = useBookingOperations();
  const checkMutation = useCheckAvailability();

  const checkAvailability = () => {
    if (courtId && date && startTime && endTime) {
      return checkMutation.mutate({
        courtId,
        startTime: `${date} ${startTime}`,
        endTime: `${date} ${endTime}`,
      });
    }
  };

  return {
    checkAvailability,
    isChecking: checkMutation.isPending,
    availabilityResult: checkMutation.data,
    error: checkMutation.error,
  };
};

// Get booking conflicts for a time slot
export const useBookingConflicts = (courtId: number, startTime: string, endTime: string) => {
  return usePaginatedQuery<{ conflicts: Booking[] }>('/bookings/conflicts', {
    params: { courtId, startTime, endTime },
    queryOptions: {
      enabled: !!courtId && !!startTime && !!endTime,
      staleTime: 1 * 60 * 1000, // 1 minute for conflict checking
    },
  });
};
