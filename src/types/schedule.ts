import { DayOfWeek } from './enums';
import { Course } from './course';

export interface Schedule {
  id: number;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  course: Course;
}

