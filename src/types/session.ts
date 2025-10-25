import { SessionStatus, PaymentStatus } from './enums';
import { Course } from './course';
import { SessionEarning } from './session-earning';
import { WalletTransaction } from './wallet-transaction';

export interface Session {
  id: number;
  sessionNumber: number;
  startTime: string; // ISO datetime string
  endTime: string; // ISO datetime string
  location?: string;
  status: SessionStatus;
  videoConferenceUrl?: string | null;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  course: Course;
  sessionEarnings?: SessionEarning[];
  transactions?: WalletTransaction[];
}
