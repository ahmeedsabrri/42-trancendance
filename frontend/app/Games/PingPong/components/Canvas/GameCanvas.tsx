'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useGameStateStore } from '../../../store/CanvasStore';
import { useGameStore } from '../../../store/GameStore';
import { useWebSocketStore } from '../../../store/WebSocketStore';
import * as canvas from './gameRenderer';
import { useRouter } from 'next/navigation';

const GameCanvas = () => {
    
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { currentState, selectedMode } = useGameStore();
    const { player1, player2, ball } = useGameStateStore();
    const { setKeyPressed } = useGameStateStore();
    const { updatePaddles } = useGameStateStore();
    const { updateBall } = useGameStateStore();
    const { setWinner, winner } = useGameStateStore();
    const { connect, disconnect, sendMessage } = useWebSocketStore();

    const player1Ref = useRef(player1);
    const player2Ref = useRef(player2);
    const ballRef = useRef(ball);
    const winnerRef = useRef(winner);
    const currentStateRef = useRef(currentState);
    const selectedModeRef = useRef(selectedMode);
    console.log(selectedMode);

    // useEffect(() => {
    //     selectedModeRef.current = selectedMode;
    //     if (!selectedModeRef.current)  {
    //         router.push('/Games/GameMode/');
    //     }
    // }, [selectedMode]);

    useEffect(() => {
        ballRef.current = ball;
        player2Ref.current = player2;
        player1Ref.current = player1;
        winnerRef.current = winner;
    }, [player2, player1, ball]);

    useEffect(() => {
        currentStateRef.current = currentState;
        if (currentStateRef.current === "PAUSE") {
            sendMessage({ "Action": "PAUSE", "GameState": "PAUSE" });
        } else if (currentStateRef.current === "PLAY") {
            sendMessage({ "Action": "PLAY", "GameState": "PLAY" });
        }
    }, [currentState, sendMessage]);


    useEffect(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;

        const ctx = cvs.getContext('2d');
        if (!ctx) return;

        const handleWebSocketMessage = (e: MessageEvent) => {
            const data = JSON.parse(e.data);
            const { BALL, PLAYERS, WINNER } = data['gameState'];
            updateBall(BALL);
            updatePaddles(PLAYERS["PLAYER1"], PLAYERS["PLAYER2"]);
            setWinner(WINNER);
            render();
        };

        connect(`ws://localhost:8000/ws/game/${selectedModeRef.current}Game/`, handleWebSocketMessage); // online // status waiting 
        const handleKey = (e: KeyboardEvent, isPressed: boolean) => {
            const validKeys = ["ArrowUp", "ArrowDown", "w", "s"];
            if (currentStateRef.current === "PLAY" && validKeys.includes(e.key)) {
                sendMessage({ "Action": "MovePaddles", "key": e.key, "isPressed": isPressed });
                setKeyPressed(e.key, isPressed);
            }
        };

        const keydownHandler = (e: KeyboardEvent) => handleKey(e, true);
        const keyupHandler = (e: KeyboardEvent) => handleKey(e, false);

        const render = () => {
            ctx.clearRect(0, 0, canvas.CANVAS_CONFIG.WIDTH, canvas.CANVAS_CONFIG.HEIGHT);
            canvas.drawTable(ctx);
            canvas.drawNet(ctx);
            canvas.drawPaddle(ctx, player1Ref.current);
            canvas.drawPaddle(ctx, player2Ref.current);
            canvas.drawBall(ctx, ballRef.current);
        };

        document.addEventListener('keydown', keydownHandler);
        document.addEventListener('keyup', keyupHandler);

        return () => {
            document.removeEventListener('keydown', keydownHandler);
            document.removeEventListener('keyup', keyupHandler);
            setWinner("");
            disconnect();
        };
    }, [connect, disconnect, sendMessage, setKeyPressed, setWinner]);

    return (
        <canvas
            ref={canvasRef}
            width={canvas.CANVAS_CONFIG.WIDTH}
            height={canvas.CANVAS_CONFIG.HEIGHT}
            className="border-cyan-200 rounded-sm"
        />
    );
}

export default GameCanvas;
