// Session Management Types

export interface Session {
  id: string;
  learner: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  coach: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };

  // Session Details
  scheduledTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  duration: number; // minutes
  type: 'online' | 'offline';
  location?: string; // for offline sessions
  subject: string;
  objectives: string[];

  // Status & Progress
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  progressNotes?: string;
  skillsImproved?: string[];
  areasToFocus?: string[];
  homework?: string;

  // Payment & Pricing
  hourlyRate: number;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'partial_refund';
  refundAmount?: number;
  refundReason?: string;

  // Feedback & Rating
  learnerFeedback?: {
    rating: number; // 1-5
    comment: string;
    createdAt: string;
  };
  coachFeedback?: {
    rating: number; // 1-5
    comment: string;
    createdAt: string;
  };

  // Video Recording
  recordingUrl?: string;
  recordingDuration?: number; // minutes
  hasRecording: boolean;

  // Reports & Issues
  reports: SessionReport[];
  hasIssues: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface SessionReport {
  id: string;
  sessionId: string;
  reporterId: string;
  reporterType: 'learner' | 'coach';
  reporterName: string;
  reportedId: string;
  reportedType: 'learner' | 'coach';
  reportedName: string;

  reason:
    | 'no_show'
    | 'late_arrival'
    | 'unprofessional'
    | 'poor_quality'
    | 'technical_issues'
    | 'payment_dispute'
    | 'inappropriate_behavior'
    | 'other';
  title: string;
  description: string;
  evidence?: string[]; // URLs to uploaded files

  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';

  adminNotes?: string;
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface SessionStats {
  total: number;
  completed: number;
  cancelled: number;
  scheduled: number;
  inProgress: number;
  noShow: number;

  totalRevenue: number;
  refundedAmount: number;
  pendingPayments: number;

  totalReports: number;
  pendingReports: number;
  resolvedReports: number;

  avgRating: number;
  totalRatings: number;
}

export interface GetSessionsParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  type?: string;
  coachId?: string;
  learnerId?: string;
  dateRange?: [string, string];
  hasIssues?: boolean;
  hasRecording?: boolean;
}

export interface GetSessionsResponse {
  sessions: Session[];
  total: number;
  page: number;
  limit: number;
  stats: SessionStats;
}

export interface AdminAction {
  type:
    | 'refund'
    | 'partial_refund'
    | 'suspend_coach'
    | 'suspend_learner'
    | 'warn_coach'
    | 'warn_learner'
    | 'resolve_report';
  sessionId: string;
  targetId: string;
  reason: string;
  amount?: number; // for refunds
  notes?: string;
  evidence?: string[];
  adminId: string;
}

export interface RefundRequest {
  sessionId: string;
  amount: number;
  reason: string;
  adminId: string;
  notes?: string;
}

export interface SuspendUserRequest {
  userId: string;
  userType: 'coach' | 'learner';
  sessionId: string;
  reason: string;
  duration?: number; // days, 0 = permanent
  adminId: string;
  notes?: string;
  evidence?: string[];
}

export interface WarnUserRequest {
  userId: string;
  userType: 'coach' | 'learner';
  sessionId: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  adminId: string;
  notes?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
