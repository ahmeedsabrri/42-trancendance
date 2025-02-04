import { create } from 'zustand';
import axios from 'axios';

// Axios instance with base URL and credentials
const api = axios.create({
  baseURL: 'https://localhost/api/',
  withCredentials: true,
});

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
      } catch (error) {
        // Handle errors
        set({ error: error.message, isLoading: false, results: [] });
      }
    },
}));