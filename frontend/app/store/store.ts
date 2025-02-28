import { create } from 'zustand';
import axios from 'axios';
import api from '@/app/auth/utils';

export interface MatchData {
    id: number;
    opponent: string;
    game_type: string;
    result: string;
    score: string;
    played_at: string;
    user_score: number;
    status: string;
}



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
    sender: string | null;
    is_online: boolean;
    otp_uri: string;
    twofa_enabled: boolean;
}

interface UserStore {
    user: UserData | null;
    users: UserData[];
    MatchHistory: MatchData[] | null;
    viewedProfile: UserData | null,
    loading: boolean;
    error: string | null;
    isInitialized: boolean;
    fetchUsers: () => Promise<void>;
    fetchUser: () => Promise<void>;
    fetchFriend: (username:string) => Promise<void>;
    fetchMatchHistory: (id: number) => Promise<void>;
    setError: (error: string | null) => void;
    reset: () => void;
}

const initialState = {
    user: null,
    users: [],
    MatchHistory: null,
    viewedProfile: null,
    loading: true,
    error: null,
    isInitialized: false,
};

// For request deduplication
let fetchPromise: Promise<void> | null = null;

export const useUserStore = create<UserStore>((set) => ({
    ...initialState,
    fetchUsers: async () => {
        fetchPromise = api.get<UserData[]>('/users/')
            .then(response => {
                set({ 
                    users: response.data, 
                    loading: false, 
                    isInitialized: true 
                });
            })
            .catch(err => {
                if (axios.isAxiosError(err)) {
                    set({ 
                        error: err.response?.data?.message || 'Failed to fetch users', 
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

    fetchMatchHistory: async (id: number) => {
        
        fetchPromise = api.get(`/match_history/${id}`)
            .then(response => {
                set({ 
                    MatchHistory: response.data.matches,
                    loading: false,
                    isInitialized: true
                });
            })
            .catch(err => {
                if (axios.isAxiosError(err)) {
                    set({ 
                        error: err.response?.data?.message || 'Failed to fetch match history', 
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
    fetchFriend: async (username:string) => {
   
        
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