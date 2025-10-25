import { CoachVideoStatus } from './enums';
import { User } from './user';

export interface Video {
  id: number;
  title: string;
  description?: string;
  tags?: string[];
  duration: number; // in seconds
  drillName: string;
  drillDescription?: string;
  drillPracticeSets?: string;
  publicUrl: string;
  thumbnailUrl?: string;
  status: CoachVideoStatus;
  uploadedBy: User; // Coach
}

