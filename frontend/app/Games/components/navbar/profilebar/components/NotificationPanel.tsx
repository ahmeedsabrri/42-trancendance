import React from 'react';
import { X } from 'lucide-react';
import type { Notification } from '../types/notification';
import Avatar from "../Avatar";
interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: number) => void;
  onAcceptFriend: (username: string) => void;
  onRejectFriend: (username: string) => void;
}

export function NotificationPanel({
  notifications,
  onClose,
  onMarkAsRead,
  onAcceptFriend,
  onRejectFriend,
}: NotificationPanelProps) {
  return (
    <div className="absolute top-full right-0 mt-2 w-96 max-h-[32rem] overflow-hidden bg-white/10 backdrop-blur-2xl border border-white/20 rounded-lg shadow-xl flex flex-col z-50">
      {/* Header */}
      <div className="sticky top-0 flex items-center justify-between p-4 bg-white/5 backdrop-blur-md border-b border-white/10">
        <h3 className="text-white font-medium">Notifications</h3>
        <button onClick={onClose} className="text-white/60 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Notification List */}
      <div className="overflow-y-auto divide-y divide-white/10">
  {notifications.length === 0 ? (
    <div className="p-4 text-white/60 text-center">No notifications</div>
  ) : (
    notifications.map((notification) => (
      <div
        key={notification.id}
        className={`p-4 transition-colors cursor-pointer hover:bg-white/5 ${notification.read ? 'opacity-60' : ''}`}
        onClick={() => {
          if (notification.notification_type !== 'friend_request') {
            onMarkAsRead(notification.id);
            // redirect(`/profile/${notification.sender?.username}`);
          }

        }}
      >
        <div className="flex items-start gap-3">
          {/* Notification Icon */}
          <Avatar width={40} height={40} avatar={notification.sender?.avatar} />
          {/* Notification Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 justify-between">
              <div className='flex items-center gap-1'>
                <p className="text-sm font-medium text-white flex items-center gap-1">
                  {notification.sender?.username || 'System'}
                </p>
                <p className="text-xs text-white/50">{formatTime(notification.created_at)}</p>
              </div>
                
                {/* remove notifications by clicking on the X button */}
              <button onClick={onClose} className="text-white/60 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-sm text-white/70 mt-0.5">{notification.message}</p>

            {/* Friend Request Actions */}
            {notification.notification_type === 'friend_request' && !notification.read && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAcceptFriend(notification.sender?.username || '');
                    onMarkAsRead(notification.id);
                  }}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRejectFriend(notification.sender?.username || '');
                    onMarkAsRead(notification.id);
                  }}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                >
                  Decline
                </button>
              </div>
            )}
          </div>

          {/* Unread Indicator */}
          {!notification.read && (
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
          )}
        </div>
      </div>
    ))
  )}
</div>
</div>
  );
}

// Helper function to format the timestamp
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 1000 / 60);

  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};