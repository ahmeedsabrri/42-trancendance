"use client";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
    FC
  } from 'react';
  import axios from 'axios';
  
  interface User {
    id: number;
    username: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
    twofa_enabled?: boolean;
    otp_uri?:string;
    friends?: User[];
    // Add other user fields as needed
  }
  
  interface UserContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    refetchUser: () => Promise<void>;
  }
  
  const UserContext = createContext<UserContextType | null>(null);
  
  const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
  });
  
  export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/user/me');
        setUser(response.data);
        setError(null);
      } catch (err) {
        setUser(null);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch user');
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
  
    const refetchUser = async () => {
      setLoading(true);
      await fetchUser();
    };
  
    useEffect(() => {
      fetchUser();
    }, []);
  
    return (
      <UserContext.Provider
        value={{
          user,
          loading,
          error,
          refetchUser
        }}
      >
        {children}
      </UserContext.Provider>
    );
  };
  
  export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error('useUser must be used within a UserProvider');
    }
    return context;
  };
  