import { UserData } from '@/app/store/store';

export interface FriendData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar: string;
  id: number;
  status: 'online' | 'offline';
  level: number;

}

export interface GameHistory {
  id: number;
  type: 'pingpong' | 'tictactoe';
  opponent: UserData;
  result: 'win' | 'loss' | 'draw';
  date: string;
  score?: string;
}

export interface Friend {
  id: number;
  user: FriendData;
  status: 'friend' | 'blocked';
}