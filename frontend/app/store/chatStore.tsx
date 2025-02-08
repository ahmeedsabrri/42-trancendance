import { create } from "zustand";
import { pushConversationIdToUrl } from "../chat/Components/utils/utils";
import { UserData } from "./store";


export interface Message {
    id: number;
    sender: UserData;
    message: string;
    conversation_id: number;
    time: string;
}
  
export interface Conversation {
    id: number;
    user1: UserData;
    user2: UserData;
    last_message: Message;
    first_time: boolean;
    messages: Message[];
}
  
interface ConversationSelected {
    id: number;
    userTarget: UserData | null;
    last_message: Message | null;
}

interface ChatStore {
    user_id: number;
    setUserId: (user_id: number) => void;
    socket: WebSocket | null;
    setSocket: (socket: WebSocket) => void;
    freindUpdate: boolean;
    setFreindUpdate: (freindUpdate: boolean) => void;

    eventMessage: MessageEvent;
    setEventMessage: (eventMessage: MessageEvent) => void;

    search: string;
    setSearch: (search: string) => void;
    conversationSelected: ConversationSelected;
    setConversationSelected: (conversation: Conversation) => void;
    friends: UserData[];
    setFriends: (friends: UserData[]) => void;
}

const useChatStore = create<ChatStore>((set, get) => ({

    user_id: 0,
    setUserId: (user_id: number) => set({ user_id }),
    socket: null,
    setSocket: (socket: WebSocket) => set({socket}),
    freindUpdate: false,
    setFreindUpdate: (freindUpdate: boolean) => set({ freindUpdate }),

    eventMessage: new MessageEvent(""),
    setEventMessage: (eventMessage: MessageEvent) => set({ eventMessage }),

    search: "",
    setSearch: (search: string) => set({ search }),

    conversationSelected: {
        id: 0,
        userTarget: null,
        last_message: null,
    },

    setConversationSelected: (conversation: Conversation) => {
        const currentConversation = get().conversationSelected;

        if (currentConversation.id !== conversation.id) {
          set({
            conversationSelected: {
                id: conversation.id,
                userTarget: conversation.user1.id === get().user_id ? conversation.user2 : conversation.user1,
                last_message: conversation.last_message,
            },
          });
          
          pushConversationIdToUrl(conversation.id);
        }
    },

    friends: [],
    setFriends: (friends: UserData[]) => {
        set({ friends });
    },

}));

export { useChatStore };