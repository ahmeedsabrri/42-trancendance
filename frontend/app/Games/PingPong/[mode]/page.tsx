'use client'

import Game from "../components/Game";
import { useGameStore } from "../../store/GameStore";
import { useEffect } from "react";

const PingPongGame = () => {
    const { setGameMode, selectedMode } = useGameStore();

    return <Game mode={"local"} />;
}

export default PingPongGame;