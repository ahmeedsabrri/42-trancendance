import { create } from 'zustand';
import axios from 'axios';
import api from '@/app/auth/utils';

interface User {
  id: number;
  username: string;
  avatar: string;
}
interface SearchState {
  query: string;
  results: User[];
  isLoading: boolean;
  error: string | null;
  message: string;
  setQuery: (query: string) => void;
  searchUsers: () => Promise<void>;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  results: [],
  isLoading: false,
  error: null,
  message: "",

  // Update the search query
  setQuery: (query: string) => set({ query }),

  // Perform the search using Axios
  searchUsers: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get('users/search/', {
        params: {
          username: useSearchStore.getState().query, // Pass the query as a parameter
        },
      });
      if (response.data?.message) {
        set({ message: response.data.message, isLoading: false });
      }
      // Update the results
      set({ results: response.data, isLoading: false });
    }
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.message ?? 'Failed to mark notification as read' });
      } else {
        set({ error: 'An unknown error occurred' });
      }

    }
    // } catch (error: any) {
    //   set({ error: error.message, isLoading: false, results: [] });
    // }
  },
}));