export const fakeNotifications = [
  {
    id: '1',
    title: 'Friend Request',
    message: 'wants to be your friend',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    type: 'friendRequest',
    userId: 'user1',
    userName: 'Sarah Parker',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
  },
  {
    id: '2',
    title: 'New Message',
    message: 'Hey! How are you doing?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    type: 'message',
    userId: 'user2',
    userName: 'Mike Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop'
  },
  {
    id: '3',
    title: 'Friend Request Accepted',
    message: 'accepted your friend request',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: false,
    type: 'friendAccepted',
    userId: 'user3',
    userName: 'Emma Wilson',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
  }
];