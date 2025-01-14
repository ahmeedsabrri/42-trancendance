import { create } from 'zustand';
import axios from 'axios';
import { FriendData } from '../profile/types';

export const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
});

export interface UserData {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    level: number;
    avatar: string;
    status: string;
    connection_type: string;
}

interface UserStore {
    user: UserData | null;
    viewedProfile: UserData| null,
    loading: boolean;
    error: string | null;
    isInitialized: boolean;
    fetchUser: () => Promise<void>;
    fetchFriend: (username:string) => Promise<void>;
    setError: (error: string | null) => void;
    reset: () => void;
}

const initialState = {
    user: null,
    viewedProfile: null,
    loading: false,
    error: null,
    isInitialized: false,
};

// For request deduplication
let fetchPromise: Promise<void> | null = null;

export const useUserStore = create<UserStore>((set) => ({
    ...initialState,
    fetchFriend: async (username:string) => {
        set({ loading: true, error: null });
        
        fetchPromise = api.get<UserData>(`/user/${username}`)
        .then(response => {
                set({ 
                    viewedProfile: response.data, 
                    loading: false, 
                    isInitialized: true 
                });
            })
            .catch(err => {
                if (axios.isAxiosError(err)) {
                    set({ 
                        error: err.response?.data?.message || 'Failed to fetch user', 
                        loading: false,
                        isInitialized: true
                    });
                } else {
                    set({ 
                        error: 'An unexpected error occurred', 
                        loading: false,
                        isInitialized: true
                    });
                }
            })
            .finally(() => {
                fetchPromise = null; // Clear the promise when done
            });

        return fetchPromise;
    },
    fetchUser: async () => {
        if (fetchPromise) {
            return fetchPromise;
        }

        set({ loading: true, error: null });
        
        fetchPromise = api.get<UserData>('/users/me/')
            .then(response => {
                set({ 
                    user: response.data, 
                    loading: false, 
                    isInitialized: true 
                });
            })
            .catch(err => {
                if (axios.isAxiosError(err)) {
                    set({ 
                        error: err.response?.data?.message || 'Failed to fetch user', 
                        loading: false,
                        isInitialized: true
                    });
                } else {
                    set({ 
                        error: 'An unexpected error occurred', 
                        loading: false,
                        isInitialized: true
                    });
                }
            })
            .finally(() => {
                fetchPromise = null;
            });

        return fetchPromise;
    },

    setError: (error: string | null) => set({ error }),

    reset: () => set(initialState)
}));