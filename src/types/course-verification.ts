// Course Verification Types

export interface Course {
  id: string;
  title: string;
  description: string;
  coverImage?: string;

  // Coach Information
  coach: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    rating: number;
    totalStudents: number;
    yearsOfExperience: number;
  };

  // Course Details
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
  language: string;
  duration: number; // total weeks
  totalSessions: number;
  sessionBlocks: SessionBlock[];

  // Pricing
  originalPrice: number;
  currentPrice: number;
  currency: string;

  // Course Status
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'requires_changes';
  priority: 'low' | 'medium' | 'high' | 'urgent';

  // Review Information
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  requiredChanges?: string[];

  // Statistics
  stats: {
    enrolledStudents: number;
    completionRate: number;
    averageRating: number;
    totalReviews: number;
    revenue: number;
  };

  // Course Settings
  settings: {
    maxStudents?: number;
    isOnline: boolean;
    isOffline: boolean;
    location?: string;
    prerequisites?: string[];
    equipment?: string[];
    ageGroup?: string;
    difficulty: number; // 1-5
  };

  // Timestamps
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
  publishedAt?: string;
}

export interface SessionBlock {
  id: string;
  title: string;
  description: string;
  level: string; // e.g., "1.0-2.0", "2.5-3.0"
  levelRange: {
    min: number;
    max: number;
  };

  // Session Details
  totalWeeks: number;
  totalSessions: number;
  sessionsPerWeek: number;
  sessionDuration: number; // minutes

  // Content
  objectives: string[];
  topics: string[];
  skills: string[];

  // Pricing
  price: number;
  revenue: number; // calculated based on enrolled students

  // Students
  enrolledStudents: number;
  maxStudents?: number;

  // Status
  isActive: boolean;
  isOnline: boolean;
  isOffline: boolean;

  // Schedule (if applicable)
  schedule?: {
    dayOfWeek: string[];
    startTime: string;
    endTime: string;
  };
}

export interface CourseStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  draft: number;
  requiresChanges: number;

  totalRevenue: number;
  totalStudents: number;
  averageRating: number;
  completionRate: number;

  urgentReviews: number;
  avgReviewTime: number; // days
}

export interface GetCoursesParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  level?: string;
  coachId?: string;
  dateRange?: [string, string];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'createdAt' | 'submittedAt' | 'title' | 'price' | 'students';
  sortOrder?: 'asc' | 'desc';
}

export interface GetCoursesResponse {
  courses: Course[];
  total: number;
  page: number;
  limit: number;
  stats: CourseStats;
}

export interface ReviewCourseRequest {
  courseId: string;
  action: 'approve' | 'reject' | 'request_changes';
  notes?: string;
  rejectionReason?: string;
  requiredChanges?: string[];
  publishImmediately?: boolean;
  adminId: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Filter Options
export interface CourseFilterOptions {
  statuses: { value: string; label: string }[];
  priorities: { value: string; label: string }[];
  categories: { value: string; label: string }[];
  levels: { value: string; label: string }[];
  languages: { value: string; label: string }[];
}

// Course Categories
export const COURSE_CATEGORIES = [
  'Kỹ thuật cơ bản',
  'Chiến thuật nâng cao',
  'Thi đấu đôi',
  'Thi đấu đơn',
  'Huấn luyện trẻ em',
  'Phục hồi chấn thương',
  'Thể lực và sức bền',
  'Mental Training',
  'Tournament Preparation',
  'Referee Training',
] as const;

// Rejection Reasons
export const REJECTION_REASONS = [
  'Nội dung khóa học không phù hợp với mô tả',
  'Giá khóa học quá cao so với thị trường',
  'Thiếu thông tin chi tiết về session blocks',
  'Mô tả khóa học không rõ ràng',
  'Không có đủ kinh nghiệm để dạy level này',
  'Session blocks không hợp lý về thời gian',
  'Thiếu prerequisites và equipment',
  'Ảnh cover không phù hợp',
  'Mục tiêu học tập không rõ ràng',
  'Lý do khác (ghi rõ trong ghi chú)',
] as const;

// Required Changes
export const REQUIRED_CHANGES = [
  'Cập nhật mô tả khóa học chi tiết hơn',
  'Điều chỉnh giá khóa học',
  'Bổ sung thông tin về session blocks',
  'Thêm prerequisites rõ ràng',
  'Cập nhật ảnh cover chất lượng cao',
  'Làm rõ mục tiêu học tập',
  'Bổ sung thông tin về equipment',
  'Điều chỉnh thời gian session blocks',
  'Thêm thông tin về độ tuổi phù hợp',
  'Cải thiện cấu trúc khóa học',
] as const;

export type CourseCategory = (typeof COURSE_CATEGORIES)[number];
export type RejectionReason = (typeof REJECTION_REASONS)[number];
export type RequiredChange = (typeof REQUIRED_CHANGES)[number];
