import { Session } from './session';
import { Video } from './video';

export interface SessionVideo {
  id: number;
  createdAt: Date;
  session: Session;
  video: Video;
}

