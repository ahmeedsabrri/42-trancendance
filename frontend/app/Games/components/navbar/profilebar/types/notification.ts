export type NotificationType = 'message' | 'friend_request' | 'friend_accept' | 'game_invite' | 'game_accept' | 'game_decline' | 'game_cancel';


export interface userNotif {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar: string;
  id: number;
  status: string;
  level: number;
  is_online: boolean;
}

export interface Notificationdata {
  id: number
  notification_type: NotificationType;
  read: boolean;
  created_at: string;
  message: string;
  sender: userNotif;
}