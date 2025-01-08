import { create } from 'zustand';
import axios from 'axios';
import { FriendData } from '../profile/types';
import exp from 'constants';

const api = axios.create({
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
    friends?: FriendData[];
}

interface UserStore {
    user: UserData | null;
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
    loading: false,
    error: null,
    isInitialized: false,
};

// For request deduplication
let fetchPromise: Promise<void> | null = null;

export const useUserStore = create<UserStore>((set) => ({
    ...initialState,

    fetchFriend: async (username:string) => {
        // If there's already a fetch in progress, return that promise
        if (fetchPromise) {
            return fetchPromise;
        }

        set({ loading: true, error: null });
        
        // Create new promise and store it
        fetchPromise = api.get<UserData>('/profile/'+username+'/')
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
                fetchPromise = null; // Clear the promise when done
            });

        return fetchPromise;
    },
    fetchUser: async () => {
        // If there's already a fetch in progress, return that promise
        if (fetchPromise) {
            return fetchPromise;
        }

        set({ loading: true, error: null });
        
        // Create new promise and store it
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
                fetchPromise = null; // Clear the promise when done
            });

        return fetchPromise;
    },

    setError: (error: string | null) => set({ error }),

    reset: () => set(initialState)
}));