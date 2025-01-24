'use client'

import Link from "next/link"
import CustomButton from "../../../components/utils/CutsomButton"
import { useEffect, useRef, useCallback } from 'react';
import { useGameStateStore } from '../../../store/CanvasStore';
import { useGameStore } from '../../../store/GameStore';
import WaitingForPlayer from "../waitingPlayer";
import * as canvas from './gameRenderer';
import { useParams } from 'next/navigation';
import useWebSocket, { ReadyState } from 'react-use-websocket';

interface GameState {
    game: {
        BALL: any;
        PLAYERS: {
            PLAYER1: any;
            PLAYER2: any;
        };
        WINNER?: any,
    },
    gameStatus: any,
}

const Canvas = () => {
    const { label, currentState, handleCurrentState } = useGameStore();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { player1, player2, ball } = useGameStateStore();
    const { setKeyPressed, updatePaddles, updateBall, setWinner, setGameStatus, resetCountdown, game_status, countdown} = useGameStateStore();

    const mode = useParams().mode;
    const currentStateRef = useRef(currentState);
    const socketUrl = `ws://localhost:8000/ws/game/${mode}Game/`;

    const {
        sendJsonMessage,
        lastJsonMessage,
        readyState,
    } = useWebSocket<GameState>(socketUrl, {
        shouldReconnect: (closeEvent) => false,
        onError: (event) => console.log('WebSocket error:', event),
        onOpen: () => console.log('WebSocket connected'),
        onClose: () => console.log('WebSocket disconnected'),
    });

    useEffect(() => {
        if (!countdown && mode === "online")
        {
            console.log("send the game to be updated");
            handleCurrentState();
            sendJsonMessage({ "Action": "StartGame" });
        }
    }, [countdown]);

    useEffect(() => {
        if (lastJsonMessage) {

            if (mode === "online" && lastJsonMessage.gameStatus) {
                console.log(`Received game status: ${lastJsonMessage.gameStatus}`);
                setGameStatus(lastJsonMessage.gameStatus);
            }

            if (lastJsonMessage.game)
            {
                const { BALL, PLAYERS, WINNER } = lastJsonMessage.game;
                updateBall(BALL);
                updatePaddles(PLAYERS["PLAYER1"], PLAYERS["PLAYER2"]);
                if (WINNER)
                    setWinner(WINNER);
            }
        }
    }, [lastJsonMessage, mode, setGameStatus, updateBall, updatePaddles, setWinner]);

    useEffect(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;

        const ctx = cvs.getContext('2d');
        if (!ctx) return;

        const render = () => {
            ctx.clearRect(0, 0, canvas.CANVAS_CONFIG.WIDTH, canvas.CANVAS_CONFIG.HEIGHT);
            canvas.drawTable(ctx);
            canvas.drawNet(ctx);
            canvas.drawPaddle(ctx, player1);
            canvas.drawPaddle(ctx, player2);
            canvas.drawBall(ctx, ball);
        };

        render();
    }, [player1, player2, ball]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent, isPressed: boolean) => {
            const validKeys = ["ArrowUp", "ArrowDown", "w", "s"];
            if (currentStateRef.current === "PLAY" && validKeys.includes(e.key)) {
                sendJsonMessage({ "Action": "MovePaddles", "key": e.key, "isPressed": isPressed });
                setKeyPressed(e.key, isPressed);
            }
        };

        const keydownHandler = (e: KeyboardEvent) => handleKey(e, true);
        const keyupHandler = (e: KeyboardEvent) => handleKey(e, false);

        document.addEventListener('keydown', keydownHandler);
        document.addEventListener('keyup', keyupHandler);

        return () => {
            document.removeEventListener('keydown', keydownHandler);
            document.removeEventListener('keyup', keyupHandler);
            resetCountdown();
        };
    }, [sendJsonMessage, setKeyPressed]);

    useEffect(() => {
        currentStateRef.current = currentState;

        if (mode === "local")
        {
            const gameState = currentStateRef.current === "PAUSE" ? "PAUSE" : "PLAY";
            sendJsonMessage({ "Action": gameState});
        }
        console.log(mode);
    }, [currentState, mode, sendJsonMessage]);

    const GameControls = mode === "local" ? (
        <div className='flex justify-between items-center w-[100%]'>
            <Link href={"/Games"}>
                <CustomButton
                    label="EXIT"
                    className="mt-5 text-white text-4xl font-bold bg-gray-800 bg-opacity-30 backdrop-blur-xl px-16 py-6 hover:bg-opacity-40 rounded-3xl outline-none"
                />
            </Link>
            <CustomButton
                label={label}
                onClick={handleCurrentState}
                className="mt-5 text-white text-4xl font-bold bg-gray-800 bg-opacity-30 backdrop-blur-xl px-16 py-6 hover:bg-opacity-40 rounded-3xl outline-none"
            />
        </div>
    ) : null;

    if (mode === "online")
    {
        if (game_status === "waiting") 
            return <WaitingForPlayer />
        else if (game_status === "ready" && countdown > 0)
            return <WaitingForPlayer />
    }

    return (
        <div className="flex justify-center flex-col items-center p-4 bg-gray-500 bg-opacity-30 backdrop-blur-xl rounded-xl mt-10">
            <canvas
                ref={canvasRef}
                width={canvas.CANVAS_CONFIG.WIDTH}
                height={canvas.CANVAS_CONFIG.HEIGHT}
                className="border-cyan-200 rounded-sm"
            />
            { GameControls }
        </div>
    );
};

export default Canvas;
