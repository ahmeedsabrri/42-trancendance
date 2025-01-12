'use client'

import { useEffect } from "react";

interface GameProps {
    mode: 'local' | 'online';
}

const Game: React.FC<GameProps> = ({ mode }) => {
    useEffect(() => {
        if (mode === 'online') {
            // Initialize websocket connection for TicTacToe
        }
    }, [mode]);

    return (
        console.log('Game component')
    );
};

export default Game;