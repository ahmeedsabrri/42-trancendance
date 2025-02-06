import { create } from 'zustand';
import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://localhost/api',
    withCredentials: true,
});



export interface UserFriendsData {
    first_name: string;
    last_name: string;
    username: string; 
    email: string;
    avatar: string;
    id: number;
    status: string;
    level: number;
}

interface UserFriendsStore {
    Userfriends: UserFriendsData[] | null;
    UserOwnfriends: UserFriendsData[] | null;
    fetchUserFriends: (username:string) => Promise<void>;
    fetchOwnFriends: () => Promise<void>;
    loading: boolean;
    error: string | null;
    isIn: boolean;
}

const initialState = {
    Userfriends: null,
    UserOwnfriends: null,
    loading: false,
    error: null,
    isIn: false,
};


let fetchUserPromise: Promise<void> | null = null;
let fetchOwnPromise: Promise<void> | null = null;

export const useUserFriendsStore = create<UserFriendsStore>((set) => ({
    ...initialState,
    fetchUserFriends: async (username:string) => {
        if (fetchUserPromise) {
            return fetchUserPromise;
        }

        set({ loading: true, error: null });
        
        console.log('fetching friends')
        fetchUserPromise = api.get<UserFriendsData[]>(`/users/friends/${username}`)
            .then(response => {
                set({ 
                    Userfriends: response.data,
                    loading: false,
                    isIn: true,
                });
            })
            .catch(error => {
                set({ error: error.message });
            })
            .finally(() => {
                set({ loading: false });
                fetchUserPromise = null;
            });
            
            return fetchUserPromise;
    },
    fetchOwnFriends: async () => {
        console.log('fetching own friends')
        if (fetchOwnPromise) {
            return fetchOwnPromise;
        }
        
        set({ loading: true, error: null });
        
        fetchOwnPromise = api.get<UserFriendsData[]>('/users/me/friends/')
        .then(response => {
            set({ 
                UserOwnfriends: response.data, 
                loading: false, 
                isIn: true 
            });
            })
            .catch(error => {
                set({ error: error.message });
            })
            .finally(() => {
                set({ loading: false });
                fetchOwnPromise = null;
            });

        return fetchOwnPromise;
    }
}));