import { UserData } from '@/app/store/store';

export interface FriendData {
  id: number;
  username: string;
  level: number;
  avatar: string;

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