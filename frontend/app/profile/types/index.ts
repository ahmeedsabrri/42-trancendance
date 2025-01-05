export interface User {
  id: string;
  name: string;
  level: number;
  avatar: string;
  coverImage: string;
  status: 'online' | 'offline';
}

export interface GameHistory {
  id: string;
  type: 'pingpong' | 'tictactoe';
  opponent: User;
  result: 'win' | 'loss' | 'draw';
  date: string;
  score?: string;
}

export interface Friend {
  id: string;
  user: User;
  status: 'friend' | 'blocked';
}