export type NotificationType = 'message' | 'alert' | 'update' | 'friendRequest' | 'friendAccepted';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: NotificationType;
  userId?: string;
  userName?: string;
  userAvatar?: string;
}