import { Course } from './course';
import { User } from './user';

export interface Feedback {
  id: number;
  comment: string;
  rating: number; // 1-5
  createdAt: Date;
  deletedAt?: Date;
  createdBy: User; // Learner user
  course: Course;
}

