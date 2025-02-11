"use client"

import axios, {AxiosResponse} from "axios";
import { sortConversationsByDate } from "../Components/utils/utils";
import api from "@/app/auth/utils";
const source = axios.CancelToken.source();

const getNotifications = async () => {
    try {
        const response = await api.get(`/notifications/`);
        return response.data;
    }
    catch (error) {

    }
}

const newConversation = async (user: number) => {
    try {
        const response = await api.post(`/chat/new_conversation/${user}/`);
        return response.data;
    }
    catch (error) {
    }
}

const fetchConversations = async () => {
    try {
        const response : AxiosResponse = await api.get(`/chat/conversations/`);
        if (!response.data) {
            return [];
        }
        return sortConversationsByDate(response.data);
    }
    catch (error) {
    }
};

const fetchMessages = async (conversation_id: number) => {
    try {
        const response : AxiosResponse = await api.get(`/chat/conversation/${conversation_id}/messages/`);
        return response.data;
    }
    catch (error) {
    }
}

const getMatcheHistory = async (id: number) => {
    try {
        const response = await api.get(`match_history/${id}`);
        return response.data.matches;    
    }
    catch (error) {
    }
}

const handleRequestGames = async (username:string, type:string) => {
    
    try {
        const response = await api.get(`users/request/${type}/${username}/`);
        return response;
    }
    catch (error) {
    }
}

source.cancel('Operation canceled by the user.');

export { fetchConversations, fetchMessages, newConversation, getNotifications, handleRequestGames, getMatcheHistory };