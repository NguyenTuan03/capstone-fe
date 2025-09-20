export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'user' | 'coach' | 'admin';
  status: 'active' | 'banned' | 'pending_coach_approval';
  location: string;
  joinDate: string;
  lastLogin: string;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  banReason?: string;
  bannedAt?: string;
  bannedBy?: string;
}

export interface SkillAssessment {
  completedAt: string;
  score: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface CoachProfile {
  isVerified: boolean;
  verifiedAt?: string;
  certifications: string[];
  specialties: string[];
  experience: number;
  hourlyRate: number;
  rating: number;
  totalSessions: number;
  bio: string;
}

export interface CoachApplication {
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  requestedSpecialties: string[];
  requestedRate: number;
  motivation: string;
}

export interface AdminProfile {
  permissions: string[];
  departement: string;
}

export interface ActivityHistory {
  date: string;
  action: string;
  type: 'lesson_completed' | 'booking_created' | 'video_uploaded' | 'session_completed' | 'booking_received' | 'account_banned' | 'violation_reported' | 'coach_application_submitted' | 'assessment_completed' | 'admin_action';
}

export interface UserStats {
  lessonsCompleted?: number;
  sessionsBooked?: number;
  videosUploaded?: number;
  totalTimeSpent?: number;
  sessionsCompleted?: number;
  studentsCoached?: number;
  totalEarnings?: number;
  averageRating?: number;
  usersManaged?: number;
  coachesApproved?: number;
  contentApproved?: number;
  totalActions?: number;
}

export interface UserDetail extends User {
  skillAssessment?: SkillAssessment;
  coachProfile?: CoachProfile;
  coachApplication?: CoachApplication;
  adminProfile?: AdminProfile;
  activityHistory: ActivityHistory[];
  stats: UserStats;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface UserFilters {
  roles: FilterOption[];
  status: FilterOption[];
  skillLevels: FilterOption[];
}

export interface UserListStats {
  total: number;
  active: number;
  banned: number;
  pendingApproval: number;
  users: number;
  coaches: number;
  admins: number;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  skillLevel?: string;
}

export interface GetUsersResponse {
  users: UserDetail[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserApiResponse {
  users: UserDetail[];
  filters: UserFilters;
  stats: UserListStats;
}
