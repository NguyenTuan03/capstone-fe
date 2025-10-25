import { SessionEarningStatus } from './enums';
import { Session } from './session';

export interface SessionEarning {
  id: number;
  sessionPrice: number;
  coachEarningTotal: number;
  status: SessionEarningStatus;
  createdAt: Date;
  paidAt?: Date;
  session: Session;
}

