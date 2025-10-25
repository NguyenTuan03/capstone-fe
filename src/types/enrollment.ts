import { EnrollmentStatus } from './enums';
import { Course } from './course';
import { User } from './user';
import { Payment } from './payment';

export interface Enrollment {
  id: number;
  status: EnrollmentStatus;
  enrolledAt: Date;
  updatedAt: Date;
  course: Course;
  user: User; // Learner user
  payments?: Payment[];
}

