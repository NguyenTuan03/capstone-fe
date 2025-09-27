// Coach Management Types

export interface Coach {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'suspended' | 'pending' | 'rejected';
  location?: string;
  joinDate: string;
  lastActive?: string;

  // Coach specific info
  experience: number; // years
  rating: number; // 1-5 stars
  totalSessions: number;
  totalStudents: number;
  hourlyRate: number;
  specialties: string[];
  bio: string;

  // Certificates
  certificates: Certificate[];

  // Suspension info
  suspendReason?: string;
  suspendedAt?: string;
  suspendedBy?: string;
  suspendEvidence?: string[]; // video/image URLs
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  certificateUrl?: string;
  status: 'verified' | 'pending' | 'expired' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface CoachStats {
  total: number;
  active: number;
  suspended: number;
  pending: number;
  avgRating: number;
  totalSessions: number;
}

export interface GetCoachesParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  specialty?: string;
  minRating?: number;
}

export interface GetCoachesResponse {
  coaches: Coach[];
  total: number;
  page: number;
  limit: number;
}

// Quality Management Types
export interface CoachReview {
  id: string;
  coachId: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  sessionId: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: string;

  // Video evidence for online sessions
  sessionVideo?: string;
  reviewVideo?: string;

  // Admin review
  adminReviewed: boolean;
  adminNotes?: string;
  isReported: boolean;
  reportReason?: string;
}

export interface CoachQuality {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  status: 'active' | 'suspended';

  // Quality metrics
  rating: number;
  totalReviews: number;
  recentReviews: CoachReview[];

  // Performance metrics
  sessionCompletionRate: number; // %
  studentRetentionRate: number; // %
  responseTime: number; // average hours

  // Flags
  hasComplaints: boolean;
  complaintsCount: number;
  lastComplaintDate?: string;

  // Suspension info
  suspendReason?: string;
  suspendedAt?: string;
  suspendedBy?: string;
  suspendEvidence?: string[];
}

export interface SuspendCoachRequest {
  coachId: string;
  reason: string;
  evidence?: string[]; // URLs to uploaded files
  adminId: string;
  notes?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
