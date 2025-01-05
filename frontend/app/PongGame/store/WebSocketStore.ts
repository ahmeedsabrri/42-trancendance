'use client'
import { create } from "zustand"

interface GameState {
    BALL: any;
    PLAYERS: {
        PLAYER1: any;
        PLAYER2: any;
    };
}

interface WebSocketStore { 
    socket: WebSocket | null;
    connect: (url: string, onMessage?: (event: MessageEvent) => void) => void;
    disconnect: () => void;
    sendMessage: (message: any) => void;
    handleGameState: (gameState: GameState) => void;
    onMessageCallback?: (event: MessageEvent) => void;
}

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
    socket: null,
    onMessageCallback: undefined,
    connect: (url, onMessage) => {
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('WebSocket client connected!');
        };

        ws.onerror = (error) => {
            console.log("WebSocket connection error:", error);
        };

        ws.onmessage = (event) => {
            if (onMessage) {
                onMessage(event);
            } else {
                console.log('Message from server:', event.data);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        set({ socket: ws, onMessageCallback: onMessage });
    },
    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.close();
            set({ socket: null, onMessageCallback: undefined });
        }
    },
    sendMessage: (message: any) => {
        const { socket } = get();
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    },
    handleGameState: (gameState: GameState) => {
        // Add any game state handling logic here if needed
    }
}));