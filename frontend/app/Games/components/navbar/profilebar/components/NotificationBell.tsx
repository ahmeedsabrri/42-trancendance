import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
}

export function NotificationBell({ count = 0, onClick }: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className="relative p-3 transition-all duration-300 rounded-full 
                bg-white/10 backdrop-blur-md border border-white/20 
                hover:bg-white/20 active:scale-95 group"
      aria-label="Notifications"
    >
      <Bell className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center 
                       bg-red-500 text-white text-xs font-bold rounded-full 
                       animate-in fade-in duration-200">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}