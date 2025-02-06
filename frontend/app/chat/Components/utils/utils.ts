"use client";

import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { Conversation } from '@/app/store/chatStore';
import { UserData } from '@/app/store/store';
import { UserFriendsData } from '@/app/store/UserFriendsStrore';


const secretKey = "f2a55ff22864a0ea4791baed9c1607fa07dcbdcd70dee5e117e35ede141a193f";

export function timeHandle(time: string) {
    if (!time)
        return "";
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} PM`;
}

export function filterFriends(friends: UserFriendsData[] | null, search: string) {
    if (!friends)
        return [];
    return friends.filter((friend: UserFriendsData) => friend.username.toLowerCase().includes(search));
}

export function sortFriendsByName(friends: UserFriendsData[] | null) {
    if (!friends)
        return [];
    return friends.sort((a: UserFriendsData, b: UserFriendsData) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()));
}

const useDelayedLoading = (isLoading: boolean, delay: number) => {
    const [delayedLoading, setDelayedLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDelayedLoading(isLoading);
        }, delay);

        return () => clearTimeout(timer);
    }, [isLoading, delay]);

    return delayedLoading;
};


export function encryptNumber(number: number) {
    return CryptoJS.AES.encrypt(number.toString(), secretKey).toString();
}

export function decryptNumber(hash: string) {
    const bytes = CryptoJS.AES.decrypt(hash, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export function pushConversationIdToUrl(conversationId: number) {
    const params = new URLSearchParams(window.location.search);
    const existingId = params.get('conversationId');
    if (existingId !== encryptNumber(conversationId))
    {
        if (existingId)
            params.delete('conversationId');
        params.set('conversationId', encryptNumber(conversationId));
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, '', newUrl);
    }
}

export function findConversation(user1: number, user2: number, conversations: Conversation[]): Conversation | null {

    if (!user1 || !user2 || !conversations)
        return null;

    const conversation = conversations.find((conversation) => {
        if ((conversation.user1.id === user1 && conversation.user2.id === user2) || 
            (conversation.user1.id === user2 && conversation.user2.id === user1)) {
            return true;
        }
        return false;
    });

    return conversation || null;
}

export function findConversationById(conversations: Conversation[], id: number) {
    if (!conversations)
        return null;
    const filtredConversation = conversations.find((conversation: Conversation) => conversation.id === id)

    return filtredConversation as Conversation;
}

export function findTargetUser(conversation: Conversation, user_id: number) {
    const target: UserData = conversation.user1?.id === user_id ? conversation.user2 : conversation.user1;
    return target;
}

export function sortConversationsByDate(conversations: Conversation[] | null) {
    if (!conversations)
        return [];
    return conversations.sort((a: Conversation, b: Conversation) => {
        if (!a.last_message)
            return -1;
        if (!b.last_message)
            return 1;
        return new Date(b.last_message.time).getTime() - new Date(a.last_message.time).getTime();
    });
}

export default useDelayedLoading;