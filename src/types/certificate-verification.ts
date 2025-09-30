// Certificate Verification Types

export interface CoachApplication {
  id: string;
  applicant: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    address: string;
    city: string;
    country: string;
  };

  // Professional Information
  professionalInfo: {
    yearsOfExperience: number;
    specialties: string[];
    playingLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
    coachingLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
    hourlyRate: number;
    preferredSchedule: string[];
    languagesSpoken: string[];
    bio: string;
    achievements?: string[];
    previousClubs?: string[];
  };

  // Certificates & Documents
  certificates: CoachCertificate[];
  documents: CoachDocument[];

  // Application Status
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'requires_info';
  priority: 'low' | 'medium' | 'high' | 'urgent';

  // Review Information
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;

  // Timestamps
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoachCertificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  certificateNumber?: string;
  level?: string;
  type: 'coaching' | 'playing' | 'first_aid' | 'safety' | 'other';
  fileUrl: string;
  thumbnailUrl?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'expired';
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface CoachDocument {
  id: string;
  name: string;
  type: 'id_card' | 'passport' | 'background_check' | 'medical_cert' | 'insurance' | 'other';
  fileUrl: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationNotes?: string;
}

export interface ApplicationStats {
  total: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  requiresInfo: number;
  avgProcessingTime: number; // days
  urgentApplications: number;
}

export interface GetApplicationsParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  priority?: string;
  specialty?: string;
  experience?: string;
  dateRange?: [string, string];
  sortBy?: 'submittedAt' | 'name' | 'experience' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface GetApplicationsResponse {
  applications: CoachApplication[];
  total: number;
  page: number;
  limit: number;
  stats: ApplicationStats;
}

export interface ReviewApplicationRequest {
  applicationId: string;
  action: 'approve' | 'reject' | 'request_info';
  notes?: string;
  rejectionReason?: string;
  certificateReviews?: {
    certificateId: string;
    status: 'verified' | 'rejected';
    notes?: string;
  }[];
  adminId: string;
}

export interface CertificateReviewRequest {
  certificateId: string;
  status: 'verified' | 'rejected';
  notes?: string;
  adminId: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Filter Options
export interface FilterOptions {
  statuses: { value: string; label: string }[];
  priorities: { value: string; label: string }[];
  specialties: { value: string; label: string }[];
  experienceLevels: { value: string; label: string }[];
  certificateTypes: { value: string; label: string }[];
  documentTypes: { value: string; label: string }[];
}

// Common rejection reasons
export const REJECTION_REASONS = [
  'Chứng chỉ không hợp lệ hoặc đã hết hạn',
  'Thiếu chứng chỉ bắt buộc',
  'Kinh nghiệm không đủ yêu cầu',
  'Thông tin cá nhân không chính xác',
  'Giấy tờ tùy thân không rõ ràng',
  'Không có chứng chỉ sơ cấp cứu',
  'Chứng chỉ huấn luyện không được công nhận',
  'Hồ sơ không đầy đủ',
  'Không đáp ứng tiêu chuẩn chuyên môn',
  'Lý do khác (ghi rõ trong ghi chú)',
] as const;

export type RejectionReason = (typeof REJECTION_REASONS)[number];
