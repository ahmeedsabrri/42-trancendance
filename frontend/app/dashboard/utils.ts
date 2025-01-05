"use client";
import axios, {AxiosResponse} from 'axios';
// Base API setup for making HTTP requests
//Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Make sure this matches your Django URLs
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
// src/app/auth/utils.ts
interface UserInfo {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  // Add other user fields as needed
}


const getUserInfo = async (): Promise<UserInfo> => {
    try {
    //   const response: AxiosResponse<UserInfo> = await axios.get('http://localhost:8000/auth/user/me');
    const response: AxiosResponse<UserInfo> = await api.get('/auth/user/');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || 'Failed to fetch user info',
          status: error.response?.status
        };
      }
      throw { message: 'An unexpected error occurred', status: 500 };
    }
  };


  export const UserActions = () => {
    return {
      getUserInfo
    };
  };