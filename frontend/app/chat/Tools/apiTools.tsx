"use client"

import axios, {AxiosResponse} from "axios";
import { sortConversationsByDate } from "../Components/utils/utils";

const api = axios.create({
    baseURL: 'https://localhost/',
    withCredentials: true,
});

const source = axios.CancelToken.source();

const getNotifications = async () => {
    try {
        const response = await api.get(`/notifications/`);

        return response.data;
    }
    catch (error) {
        if (axios.isCancel(error)) {
            console.log('Request canceled', error.message);
        }
        else {
            console.log('Error', error);
        }
    }
    source.cancel('Operation canceled by the user.');
}

const newConversation = async (user: number) => {
    try {
        const response = await api.post(`chat/new_conversation/${user}`);
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        if (axios.isCancel(error)) {
            console.log('Request canceled', error.message);
        }
        else {
            console.log('Error', error);
        }
    }
    source.cancel('Operation canceled by the user.');
}

const fetchConversations = async () => {
    try {
        const response : AxiosResponse = await api.get(`chat/conversations`);
        if (!response.data) {
            return [];
        }
        return sortConversationsByDate(response.data);
    }
    catch (error) {
        if (axios.isCancel(error)) {
            console.log('Request canceled', error.message);
        }
        else {
            console.log('Error', error);
        }
    }
    source.cancel('Operation canceled by the user.');
};

const fetchMessages = async (conversation_id: number) => {
    try {
        const response : AxiosResponse = await api.get(`chat/conversation/${conversation_id}/messages`);
        return response.data;
    }
    catch (error) {
        if (axios.isCancel(error)) {
            console.log('Request canceled', error.message);
        }
        else {
            console.log('Error', error);
        }
    }
    source.cancel('Operation canceled by the user.');
}

const handleRequestGames = async (username:string, type:string) => {
    const response = await api.get(`api/users/request/${type}/${username}/`);
     return response;
}

export { fetchConversations, fetchMessages, newConversation, getNotifications, handleRequestGames};