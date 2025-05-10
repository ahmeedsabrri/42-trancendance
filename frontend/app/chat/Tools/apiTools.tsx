"use client"

import axios, {AxiosResponse} from "axios";
import { sortConversationsByDate } from "../Components/utils/utils";
import api from "@/app/auth/utils";
const source = axios.CancelToken.source();

const getNotifications = async () => {
    try {
        const response = await api.get(`/notifications/`,{
            withCredentials: true,
          });
        return response.data;
    }
    catch {}
}

const newConversation = async (user: number) => {
    try {
        const response = await api.post(`/chat/new_conversation/${user}/`,{
            withCredentials: true,
          });
        return response.data;
    }
    catch {}
}

const fetchConversations = async () => {
    try {
        const response : AxiosResponse = await api.get(`/chat/conversations/`,{
            withCredentials: true,
          });
        if (!response.data) {
            return [];
        }
        return sortConversationsByDate(response.data);
    }
    catch {}
};

const fetchMessages = async (conversation_id: number) => {
    try {
        const response : AxiosResponse = await api.get(`/chat/conversation/${conversation_id}/messages/`,{
            withCredentials: true,
          });
        return response.data;
    }
    catch  {}
}

const getMatcheHistory = async (id: number) => {
    try {
        const response = await api.get(`match_history/${id}`,{
            withCredentials: true,
          });
        return response.data.matches;    
    }
    catch  {}
}

const handleRequestGames = async (username:string, type:string) => {
    
    try {
        const response: AxiosResponse = await api.get(`users/request/${type}/${username}/`,{
            withCredentials: true,
          });
        return response;
    }
    catch {}
}

source.cancel('Operation canceled by the user.');

export { fetchConversations, fetchMessages, newConversation, getNotifications, handleRequestGames, getMatcheHistory };