export type NotificationType = 'message' | 'friend_request' | 'friend_accept';


export interface userNotif {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar: string;
  id: number;
  status: string;
  level: number;
}

export interface Notification {
  id: number
  notification_type: NotificationType;
  read: boolean;
  created_at: string;
  message: string;
  sender: userNotif;
}