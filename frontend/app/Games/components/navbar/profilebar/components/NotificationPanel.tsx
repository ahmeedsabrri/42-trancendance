import React, { useState } from 'react';
import { MessageSquare, AlertTriangle, RefreshCw, X, UserPlus, UserCheck, Search } from 'lucide-react';
import type { Notification } from '../types/notification';

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onAcceptFriend: (userId: string) => void;
  onRejectFriend: (userId: string) => void;
}

export function NotificationPanel({ 
  notifications, 
  onClose, 
  onMarkAsRead, 
  onAcceptFriend, 
  onRejectFriend 
}: NotificationPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'update':
        return <RefreshCw className="w-5 h-5 text-green-500" />;
      case 'friendRequest':
        return <UserPlus className="w-5 h-5 text-purple-500" />;
      case 'friendAccepted':
        return <UserCheck className="w-5 h-5 text-green-500" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    const searchLower = searchQuery.toLowerCase();
    return (
      notification.title.toLowerCase().includes(searchLower) ||
      notification.message.toLowerCase().includes(searchLower) ||
      notification.userName?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="absolute top-full right-0 mt-2 w-96 max-h-[32rem] overflow-hidden
                    bg-white/10 backdrop-blur-2xl border border-white/20 rounded-lg shadow-xl
                    flex flex-col z-50">
      <div className="sticky top-0 flex items-center justify-between p-4 
                     bg-white/5 backdrop-blur-md border-b border-white/10">
        <h3 className="text-white font-medium">Notifications</h3>
        <button onClick={onClose} className="text-white/60 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="overflow-y-auto divide-y divide-white/10">
        {filteredNotifications.length === 0 ? (
          <div className="p-4 text-white/60 text-center">
            {searchQuery ? 'No notifications found' : 'No notifications'}
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 transition-colors hover:bg-white/5
                        ${notification.read ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-3">
                {notification.userAvatar ? (
                  <img 
                    src={notification.userAvatar} 
                    alt={notification.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  getIcon(notification.type)
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">
                      {notification.userName}
                    </p>
                    <p className="text-xs text-white/50">{formatTime(notification.timestamp)}</p>
                  </div>
                  <p className="text-sm text-white/70 mt-0.5">{notification.message}</p>
                  
                  {notification.type === 'friendRequest' && notification.userId && !notification.read && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAcceptFriend(notification.userId!);
                          onMarkAsRead(notification.id);
                        }}
                        className="px-3 py-1 text-xs font-medium rounded-full
                                 bg-green-500/20 text-green-300 hover:bg-green-500/30
                                 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRejectFriend(notification.userId!);
                          onMarkAsRead(notification.id);
                        }}
                        className="px-3 py-1 text-xs font-medium rounded-full
                                 bg-red-500/20 text-red-300 hover:bg-red-500/30
                                 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
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