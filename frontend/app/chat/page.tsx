"use client";

import useNotificationStore from "../Games/components/navbar/profilebar/store/WebsocketNotifStore";
import ConversationSide from "./Components/ConversationSide/ConversationSide";
import FriendsSide from "./Components/FriendSide/FriendsSide";
import type { Notificationdata } from "../Games/components/navbar/profilebar/types/notification";
import { useEffect } from "react";

const Chat = () => {
    
    const {notifications, markAsRead} = useNotificationStore();

    useEffect(() => {
        notifications.forEach((notification: Notificationdata) => {
            if (notification.notification_type === 'message') {
                if (notification)
                    markAsRead(notification.id);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
            <div className="w-full h-5/6 bg-gray-500 bg-opacity-30 backdrop-blur-xl rounded-3xl flex items-center justify-center border-t-1 shadow-xl border-t border-l border-white/10">
                <FriendsSide />
                <ConversationSide/>
            </div>
    )
}

export default Chat;