export interface Session {
  id: string;
  learnerId: string;
  learnerName: string;
  learnerAvatar?: string;
  coachId: string;
  coachName: string;
  coachAvatar?: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: 'online' | 'offline';
  location?: string; // for offline sessions
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'failed';
  amount: number;
  currency: 'VND';
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancelReason?: string;
  refundedAt?: string;
  refundAmount?: number;
}

export interface SessionGoal {
  title: string;
  description: string;
  completed: boolean;
}

export interface ProgressNote {
  id: string;
  coachId: string;
  sessionId: string;
  content: string;
  skillsImproved: string[];
  areasToFocus: string[];
  homeworkAssigned?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionFeedback {
  id: string;
  sessionId: string;
  fromId: string;
  fromName: string;
  fromType: 'learner' | 'coach';
  toId: string;
  toName: string;
  toType: 'learner' | 'coach';
  rating: number;
  comment: string;
  aspectRatings?: {
    expertise?: number;
    communication?: number;
    punctuality?: number;
    patience?: number;
    teaching?: number;
    engagement?: number;
  };
  isReported: boolean;
  reportReason?: string;
  createdAt: string;
}

export interface SessionReport {
  id: string;
  sessionId: string;
  reporterId: string;
  reporterName: string;
  reporterType: 'learner' | 'coach';
  reportedId: string;
  reportedName: string;
  reportedType: 'learner' | 'coach';
  reason: 'no_show' | 'inappropriate_behavior' | 'technical_issues' | 'quality_issues' | 'payment_dispute' | 'other';
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  evidence?: string[];
  adminNotes?: string;
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionDetail extends Session {
  goals: SessionGoal[];
  progressNotes?: ProgressNote[];
  learnerFeedback?: SessionFeedback;
  coachFeedback?: SessionFeedback;
  reports?: SessionReport[];
  paymentDetails?: {
    transactionId: string;
    paymentMethod: string;
    paidAt?: string;
    refundTransactionId?: string;
  };
}

export interface SessionListStats {
  total: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  inProgress: number;
  noShow: number;
  totalRevenue: number;
  pendingPayments: number;
  refundedAmount: number;
}

export interface ReportStats {
  total: number;
  pending: number;
  investigating: number;
  resolved: number;
  dismissed: number;
  highPriority: number;
  avgResolutionTime: number; // in hours
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface SessionFilters {
  status: FilterOption[];
  paymentStatus: FilterOption[];
  type: FilterOption[];
  coaches: FilterOption[];
  learners: FilterOption[];
  dateRange: FilterOption[];
}

export interface ReportFilters {
  status: FilterOption[];
  priority: FilterOption[];
  reason: FilterOption[];
  reporterType: FilterOption[];
}

export interface GetSessionsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  type?: string;
  coachId?: string;
  learnerId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface GetSessionsResponse {
  sessions: SessionDetail[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetReportsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  reason?: string;
  reporterType?: string;
  sortBy?: 'createdAt' | 'priority' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface GetReportsResponse {
  reports: SessionReport[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SessionApiResponse {
  sessions: SessionDetail[];
  stats: SessionListStats;
  filters: SessionFilters;
}

export interface ReportApiResponse {
  reports: SessionReport[];
  stats: ReportStats;
  filters: ReportFilters;
}

export interface SessionAction {
  type: 'cancel' | 'refund' | 'warn_learner' | 'warn_coach' | 'resolve_report' | 'dismiss_report';
  sessionId?: string;
  reportId?: string;
  reason?: string;
  notes?: string;
  refundAmount?: number;
}

export interface SessionActionResponse {
  success: boolean;
  message: string;
  data?: any;
}
