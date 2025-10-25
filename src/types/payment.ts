import { PaymentStatus } from './enums';
import { Enrollment } from './enrollment';

export interface Payment {
  id: number;
  bankCode: string;
  amount: number;
  coachEarningTotal: number;
  status: PaymentStatus;
  externalTransactionId?: string;
  createdAt: Date;
  enrollment: Enrollment;
}

