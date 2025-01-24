export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  location: string;
  bio: string;
}

export const users: User[] = [
  {
    id: 'user1',
    name: 'Sarah Parker',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    role: 'Product Designer',
    location: 'San Francisco, CA',
    bio: 'Creating beautiful user experiences through design'
  },
  {
    id: 'user2',
    name: 'Mike Johnson',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    role: 'Software Engineer',
    location: 'New York, NY',
    bio: 'Full-stack developer passionate about React and TypeScript'
  },
  {
    id: 'user3',
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    role: 'Marketing Manager',
    location: 'London, UK',
    bio: 'Digital marketing specialist with 5+ years of experience'
  },
  {
    id: 'user4',
    name: 'Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    role: 'UX Researcher',
    location: 'Toronto, CA',
    bio: 'Helping companies understand their users better'
  },
  {
    id: 'user5',
    name: 'Lisa Chen',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    role: 'Product Manager',
    location: 'Singapore',
    bio: 'Building products that make a difference'
  }
];