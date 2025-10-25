import { CourseCredentialType } from './enums';

export interface Credential {
  id: number;
  name: string;
  description?: string;
  type: CourseCredentialType;
  publicUrl?: string;
  issuedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

