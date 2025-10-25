// Coach entity following backend structure
import { CoachVerificationStatus } from './enums';
import { User } from './user';
import { Credential } from './credential';

export interface CoachEntity {
  id: number;
  bio: string;
  specialties: string[];
  teachingMethods: string[];
  yearOfExperience: number;
  verificationStatus: CoachVerificationStatus;
  rejectionReason?: string; // Reason for rejection if status is REJECTED
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  user: User;
  credentials: Credential[];
}
