// Enums matching backend

export enum PickleballLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  PROFESSIONAL = 'PROFESSIONAL',
}

export enum CoachVerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum RoleName {
  ADMIN = 'ADMIN',
  COACH = 'COACH',
  LEARNER = 'LEARNER',
}

// Course enums
export enum CourseLearningFormat {
  INDIVIDUAL = 'INDIVIDUAL',
  GROUP = 'GROUP',
}

export enum CourseStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Credential enum
export enum CourseCredentialType {
  CERTIFICATE = 'CERTIFICATE',
  LICENSE = 'LICENSE',
  TRAINING = 'TRAINING',
  ACHIEVEMENT = 'ACHIEVEMENT',
  OTHER = 'OTHER',
}

// Enrollment enum
export enum EnrollmentStatus {
  PENDING_GROUP = 'PENDING_GROUP',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

// Video enums
export enum CoachVideoStatus {
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED',
}

// Session enums
export enum SessionStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

export enum SessionEarningStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

// Wallet & Payment enums
export enum WalletTransactionType {
  EARNING = 'EARNING', // Thu nhập từ session
  WITHDRAWAL = 'WITHDRAWAL', // Rút tiền
  REFUND = 'REFUND', // Hoàn tiền
  COMMISSION = 'COMMISSION', // Hoa hồng platform (20%)
}

export enum WithdrawalRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

// Achievement enums
export enum AchievementType {
  EVENT_COUNT = 'EVENT_COUNT',
  PROPERTY_CHECK = 'PROPERTY_CHECK',
  STREAK = 'STREAK',
}

// Schedule enum
export enum DayOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}
