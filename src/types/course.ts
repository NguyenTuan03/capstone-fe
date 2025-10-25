import { CourseLearningFormat, CourseStatus, PickleballLevel } from './enums';
import { User } from './user';
import { Session } from './session';
import { Schedule } from './schedule';

export interface Course {
  id: number;
  name: string;
  description?: string;
  level: PickleballLevel;
  learningFormat: CourseLearningFormat;
  status: CourseStatus;
  minParticipants: number;
  maxParticipants: number;
  pricePerParticipant: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  createdBy: User; // Coach user
  sessions?: Session[];
  schedules?: Schedule[];
}

