/**
 * Notification types matching backend structure
 */

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface Notification {
  id: number;
  title: string;
  body: string;
  navigateTo?: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string | Date;
  user?: {
    id: number;
    email?: string;
    name?: string;
  };
}

export interface NotificationListResponse {
  items: Notification[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MarkNotificationReadResponse {
  success: boolean;
  message?: string;
}
