import { create } from 'zustand';
import axios from 'axios';


export const api = axios.create({
    baseURL: 'http://localhost:8000/api',
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
    fetchUserFriends: (username:string) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const initialState = {
    Userfriends: null,
    loading: false,
    error: null,
};

// For request deduplication
let fetchPromise: Promise<void> | null = null;

export const useUserFriendsStore = create<UserFriendsStore>((set) => ({
    ...initialState,
    fetchUserFriends: async (username:string) => {
        if (fetchPromise) {
            return fetchPromise;
        }

        set({ loading: true, error: null });
        
        console.log('fetching friends')
        fetchPromise = api.get<UserFriendsData>(`/users/friends/${username}`)
            .then(response => {
                set({ 
                    Userfriends: response.data,
                    initial: true,
                    
                });
            })
            .catch(error => {
                set({ error: error.message });
            })
            .finally(() => {
                set({ loading: false });
                fetchPromise = null;
            });

        return fetchPromise;
    },
}));