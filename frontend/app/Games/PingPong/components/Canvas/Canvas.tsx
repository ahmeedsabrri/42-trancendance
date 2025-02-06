'use client'

import Link from "next/link"
import CustomButton from "../../../components/utils/CutsomButton"
import { useEffect, useRef, useCallback } from 'react';
import { useGameStateStore } from '../../../store/CanvasStore';
import { useGameStore } from '../../../store/GameStore';
import WaitingForPlayer from "../waitingPlayer";
import * as canvas from './gameRenderer';
import { useParams, useRouter } from 'next/navigation';
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
    PLAYERS: any,
    gameStatus: any,
}

const Canvas = () => {
    const { label, currentState, handleCurrentState, GameBoardColor,  invited_id } = useGameStore();
    const router = useRouter();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { player1, player2, ball } = useGameStateStore();
    const { setKeyPressed, updatePaddles, updateBall, setWinner, setGameStatus, resetCountdown, resetInvitedCountdown, setPlayer1info, setPlayer2info, resetPlayersInfo, game_status, countdown, invitedCountdown } = useGameStateStore();

    const mode = useParams().mode;
    const currentStateRef = useRef(currentState);
    const socketUrl = `wss://localhost/ws/game/${mode}Game/${invited_id ? invited_id : ''}`;

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
        if (!countdown && mode === "online") {
            console.log("send the game to be updated");
            handleCurrentState();
            sendJsonMessage({ "Action": "StartGame" });
        }
    }, [countdown]);

    useEffect(() => {
        if (lastJsonMessage) {

            if (mode === "online" && lastJsonMessage.gameStatus) {

                if (lastJsonMessage.PLAYERS) {
                    const PLAYERS = lastJsonMessage.PLAYERS;
                    console.log(PLAYERS);

                    if (PLAYERS.PLAYER1)
                        setPlayer1info(PLAYERS.PLAYER1 || '');
                    if (PLAYERS.PLAYER2)
                        setPlayer2info(PLAYERS.PLAYER2 || '');
                }
                setGameStatus(lastJsonMessage.gameStatus);
            }

            if (lastJsonMessage.game) {
                const { BALL, PLAYERS, WINNER } = lastJsonMessage.game;
                if (BALL)
                    updateBall(BALL);
                if (PLAYERS)
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
            resetInvitedCountdown();
            resetPlayersInfo();
        };
    }, [sendJsonMessage, setKeyPressed]);

    useEffect(() => {
        currentStateRef.current = currentState;

        if (mode === "local") {
            const gameState = currentStateRef.current === "PAUSE" ? "PAUSE" : "PLAY";
            sendJsonMessage({ "Action": gameState });
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


    useEffect(() => {
        if (game_status === "waiting" && invited_id && !invitedCountdown) {
            router.push('/Games');
        }
    }, [game_status, invited_id, invitedCountdown, router]);
    
    if (mode === "online") {
        if (game_status === "waiting" && invited_id && invitedCountdown > 0)
        {
            console.log("waiting for fro", invited_id, mode);
            return <WaitingForPlayer />
        }
        else if (game_status === "waiting") {
            console.log("wainting", invited_id, mode);
            return <WaitingForPlayer />
        }
        else if (game_status === "ready" && countdown > 0) {
            return <WaitingForPlayer />
        }
    }


    return (
        <div className="flex justify-center flex-col items-center p-4 bg-gray-500 bg-opacity-30 backdrop-blur-xl rounded-xl mt-10">
            <canvas
                ref={canvasRef}
                width={canvas.CANVAS_CONFIG.WIDTH}
                height={canvas.CANVAS_CONFIG.HEIGHT}
                className={`border-cyan-200 rounded-sm ${GameBoardColor}`}
            />
            {GameControls}
        </div>
    );
};

export default Canvas;
