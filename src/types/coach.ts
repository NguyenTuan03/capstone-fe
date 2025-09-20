export interface Coach {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'approved' | 'pending' | 'suspended' | 'rejected';
  applicationStatus: 'approved' | 'pending' | 'rejected';
  approvedAt?: string;
  approvedBy?: string;
  appliedAt?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectReason?: string;
  suspendedAt?: string;
  suspendedBy?: string;
  suspendReason?: string;
  isVerified: boolean;
  location: string;
  joinDate: string;
  lastActive?: string;
}

export interface CoachCertification {
  name: string;
  issuer: string;
  issuedDate: string;
  expiryDate: string;
  documentUrl: string;
  verified: boolean;
}

export interface CoachProfile {
  bio: string;
  experience: number;
  hourlyRate: number;
  rating: number;
  totalSessions: number;
  totalStudents: number;
  totalEarnings: number;
  specialties: string[];
  certifications: CoachCertification[];
  teachingMethods: string[];
  availability?: {
    [key: string]: string[];
  };
}

export interface CoachApplication {
  motivation: string;
  documents: ApplicationDocument[];
  requestedProfile: {
    bio: string;
    hourlyRate: number;
    specialties: string[];
    experience: number;
    teachingMethods: string[];
  };
}

export interface ApplicationDocument {
  type: string;
  name: string;
  url: string;
  uploadedAt: string;
  verified: boolean;
}

export interface CoachStats {
  thisMonth: {
    sessionsCompleted: number;
    newStudents: number;
    earnings: number;
    averageRating: number;
  };
  lastMonth: {
    sessionsCompleted: number;
    newStudents: number;
    earnings: number;
    averageRating: number;
  };
}

export interface CoachFeedback {
  id: string;
  studentId: string;
  studentName: string;
  sessionId: string;
  sessionDate: string;
  rating: number;
  comment: string;
  aspectRatings: {
    expertise: number;
    communication: number;
    punctuality: number;
    patience: number;
  };
  createdAt: string;
  reported?: boolean;
  reportReason?: string;
}

export interface CoachDetail extends Coach {
  profile?: CoachProfile;
  application?: CoachApplication;
  stats?: CoachStats;
  recentFeedbacks?: CoachFeedback[];
}

export interface CoachListStats {
  total: number;
  approved: number;
  pending: number;
  suspended: number;
  rejected: number;
  averageRating: number;
  totalSessions: number;
  totalEarnings: number;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface CoachFilters {
  status: FilterOption[];
  specialties: FilterOption[];
  rating: FilterOption[];
}

export interface GetCoachesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  specialty?: string;
  rating?: string;
}

export interface GetCoachesResponse {
  coaches: CoachDetail[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CoachApiResponse {
  coaches: CoachDetail[];
  stats: CoachListStats;
  filters: CoachFilters;
}
