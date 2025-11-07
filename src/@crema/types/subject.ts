import { SubjectStatus } from '@/components/coach/subject/createModal';
import { PickleballLevel } from '@/types/enums';

export interface Lesson {
  id: number;
  name: string;
  description?: string;
  lessonNumber: number;
  duration: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  level: PickleballLevel | string;
  status: SubjectStatus;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  publicUrl?: string | null;
  createdBy?: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber?: string | null;
    profilePicture?: string | null;
  };
  lessons?: Lesson[];
}
