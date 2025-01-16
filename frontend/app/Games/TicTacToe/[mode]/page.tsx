'use client'

import { useParams } from "next/navigation";
import Game from "../components/Game";

const TicTacToeGame = () => {
    const params = useParams();
    const mode = params.mode as 'local' | 'online';

    return <Game mode={mode} />;
}

export default TicTacToeGame;