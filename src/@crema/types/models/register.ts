export enum CourseCredentialType {
  CERTIFICATE = 'certificate',
  LICENSE = 'license',
  AWARD = 'award',
  OTHER = 'other',
}

export interface RegisterLearnerDto {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  address?: string;
  interests?: string[];
}

export interface RegisterCoachDto {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio: string;
  specialties?: string[];
  teachingMethods?: string[];
  yearOfExperience: number;
  credentials?: Array<{
    name: string;
    description?: string;
    type: CourseCredentialType;
    publicUrl?: string;
  }>;
}

export enum UserRole {
  LEARNER = 'learner',
  COACH = 'coach',
}
