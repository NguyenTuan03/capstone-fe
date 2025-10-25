export interface CoachApplication {
  id: string;
  applicant: Applicant;
  professionalInfo: ProfessionalInfo;
  certificates: Certificate[];
  documents: Document[];
  status: ApplicationStatus;
  priority: Priority;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  address: string;
  city: string;
  country: string;
}

export interface ProfessionalInfo {
  yearsOfExperience: number;
  specialties: string[];
  playingLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  coachingLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  hourlyRate: number;
  preferredSchedule: string[];
  languagesSpoken: string[];
  bio: string;
  achievements: string[];
  previousClubs: string[];
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  certificateNumber: string;
  level: string;
  type: 'coaching' | 'first_aid' | 'other';
  fileUrl: string;
  thumbnailUrl: string;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'expired';
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'id_card' | 'passport' | 'medical_cert' | 'background_check' | 'other';
  fileUrl: string;
  thumbnailUrl: string;
  uploadedAt: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationNotes?: string;
}

export type ApplicationStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'requires_info';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface ApplicationStats {
  total: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  requiresInfo: number;
  avgProcessingTime: number;
  urgentApplications: number;
}

export interface GetApplicationsParams {
  page: number;
  limit: number;
  status?: ApplicationStatus;
  priority?: Priority;
  specialty?: string;
  experience?: string;
  search?: string;
  dateRange?: [string, string];
  sortBy?: 'name' | 'experience' | 'priority' | 'submittedAt';
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
  adminId: string;
  notes?: string;
  rejectionReason?: string;
}

export interface CertificateReviewRequest {
  certificateId: string;
  status: 'verified' | 'rejected';
  adminId: string;
  notes?: string;
}

export interface FilterOptions {
  statuses: Array<{ value: string; label: string }>;
  priorities: Array<{ value: string; label: string }>;
  specialties: Array<{ value: string; label: string }>;
  experienceLevels: Array<{ value: string; label: string }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export const REJECTION_REASONS = [
  'Chứng chỉ huấn luyện không được công nhận',
  'Thiếu chứng chỉ bắt buộc',
  'Thông tin không chính xác',
  'Tài liệu không rõ ràng',
  'Không đủ kinh nghiệm',
  'Lý do khác',
] as const;
