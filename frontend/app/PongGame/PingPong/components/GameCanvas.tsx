'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useGameStateStore } from '../../store/CanvasStore';
import { useGameStore } from '../../store/PannelStore';
import { useWebSocketStore } from '../../store/WebSocketStore';

const CANVAS_CONFIG = {
    WIDTH: 1000,
    HEIGHT: 600,
    NET_SEGMENT_HEIGHT: 10,
    NET_GAP: 15,
    PADDLE_GLOW_BLUR: 15,
    BALL_GLOW_BLUR: 20,
    PADDLE_GLOW_COLOR: "rgba(0, 200, 255, 0.8)",
    BALL_GLOW_COLOR: "rgba(255, 255, 255, 0.8)",
    BACKGROUND_COLOR: "rgba(31, 41, 90, 1)",
    FPS: 60
};

interface RenderableObject {
    x: number;
    y: number;
    w?: number;
    h?: number;
    r?: number;
}

const GameCanvas = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { currentState } = useGameStore();
    const {player1, player2, ball} = useGameStateStore();
    const {setKeyPressed} = useGameStateStore();
    const {updatePaddles} = useGameStateStore();
    const {updateBall} = useGameStateStore();
    const {setWinner} = useGameStateStore();
    const { connect, disconnect, sendMessage } = useWebSocketStore();

    const player1Ref = useRef(player1);
    const player2Ref = useRef(player2);
    const ballRef = useRef(ball);
    const currentStateRef = useRef(currentState);

    useEffect(() => {
        ballRef.current = ball;
        player2Ref.current = player2;
        player1Ref.current = player1;
    }, [player2, player1, ball]);

    useEffect(() => {
        currentStateRef.current = currentState;
        if (currentStateRef.current === "PAUSE") {
            sendMessage({ "Action": "PAUSE", "GameState": "PAUSE" });
        } else if (currentStateRef.current === "PLAY") {
            sendMessage({ "Action": "PLAY", "GameState": "PLAY" });
        }
    }, [currentState, sendMessage]);

    const drawTable = useCallback((ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = CANVAS_CONFIG.BACKGROUND_COLOR;
        ctx.fillRect(0, 0, CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.HEIGHT);
    }, []);

    const drawNet = useCallback((ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = 'white';
        const netX = CANVAS_CONFIG.WIDTH / 2 - 1;

        for (let i = 0; i < CANVAS_CONFIG.HEIGHT; i += CANVAS_CONFIG.NET_GAP) {
            ctx.fillRect(netX, i, 2, CANVAS_CONFIG.NET_SEGMENT_HEIGHT);
        }
    }, []);

    const drawPaddle = useCallback((ctx: CanvasRenderingContext2D, paddle: RenderableObject) => {
        ctx.save();
        ctx.shadowBlur = CANVAS_CONFIG.PADDLE_GLOW_BLUR;
        ctx.shadowColor = CANVAS_CONFIG.PADDLE_GLOW_COLOR;
        ctx.fillStyle = 'white';
        ctx.fillRect(paddle.x, paddle.y, paddle.w!, paddle.h!);
        ctx.restore();
    }, []);

    const drawBall = useCallback((ctx: CanvasRenderingContext2D, ballObj: RenderableObject) => {
        ctx.save();
        ctx.shadowBlur = CANVAS_CONFIG.BALL_GLOW_BLUR;
        ctx.shadowColor = CANVAS_CONFIG.BALL_GLOW_COLOR;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(ballObj.x, ballObj.y, ballObj.r!, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }, []);


    useEffect(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;

        const ctx = cvs.getContext('2d');
        if (!ctx) return;

        const handleWebSocketMessage = (e: MessageEvent) => {
            const data = JSON.parse(e.data);
            const {BALL, PLAYERS, WINNER} = data['gameState'];
            updateBall(BALL);
            updatePaddles(PLAYERS["PLAYER1"], PLAYERS["PLAYER2"]);
            if (WINNER)
                setWinner(WINNER);
            render();
        };

        connect('ws://localhost:8000/ws/game/localGame/', handleWebSocketMessage);

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
            ctx.clearRect(0, 0, CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.HEIGHT);
            drawTable(ctx);
            drawNet(ctx);
            drawPaddle(ctx, player1Ref.current);
            drawPaddle(ctx, player2Ref.current);
            drawBall(ctx, ballRef.current);
        };

        document.addEventListener('keydown', keydownHandler);
        document.addEventListener('keyup', keyupHandler);

        return () => {
            document.removeEventListener('keydown', keydownHandler);
            document.removeEventListener('keyup', keyupHandler);
            disconnect();
        };
    }, [connect, disconnect, sendMessage, updateBall, updatePaddles, setKeyPressed]);

    return (
        <canvas 
            ref={canvasRef} 
            width={CANVAS_CONFIG.WIDTH} 
            height={CANVAS_CONFIG.HEIGHT} 
            className="border-cyan-200 rounded-sm" 
        />
    );
}

export default GameCanvas;



// 'use client';

// import { useEffect, useRef, useCallback } from 'react';
// import { useGameStateStore } from '../../store/CanvasStore';
// import { useGameStore } from '../../store/PannelStore';


// const CANVAS_CONFIG = {
//     WIDTH: 1000,
//     HEIGHT: 600,
//     NET_SEGMENT_HEIGHT: 10,
//     NET_GAP: 15,
//     PADDLE_GLOW_BLUR: 15,
//     BALL_GLOW_BLUR: 20,
//     PADDLE_GLOW_COLOR: "rgba(0, 200, 255, 0.8)",
//     BALL_GLOW_COLOR: "rgba(255, 255, 255, 0.8)",
//     BACKGROUND_COLOR: "rgba(31, 41, 90, 1)",
//     FPS: 60
// };

// interface RenderableObject {
//     x: number;
//     y: number;
//     w?: number;
//     h?: number;
//     r?: number;
// }

// const GameCanvas = () => {

//     const canvasRef = useRef<HTMLCanvasElement>(null);
    
//     const { currentState } = useGameStore();
    
//     const { player1, player2, ball, setKeyPressed, updatePaddles, updateBall, } = useGameStateStore();

//     const ws = useRef<WebSocket | null>(null);
//     const player1Ref = useRef(player1);
//     const player2Ref = useRef(player2);
//     const ballRef = useRef(ball);
//     const currentStateRef = useRef(currentState);

//     useEffect(() => {
//         ballRef.current = ball;
//         player2Ref.current = player2;
//         player1Ref.current = player1;
//     }, [player2, player1, ball]);

//     useEffect(() => {
//         currentStateRef.current = currentState;
//         if (currentStateRef.current === "PAUSE") {
//             ws.current && ws.current.send(JSON.stringify({ "Action": "PAUSE", "GameState": "PAUSE" }));
//         } else if (currentStateRef.current === "PLAY")
//             ws.current && ws.current.send(JSON.stringify({ "Action": "PLAY", "GameState": "PLAY" }));
//     }, [currentState]);

//     const drawTable = useCallback((ctx: CanvasRenderingContext2D) => {
//         ctx.fillStyle = CANVAS_CONFIG.BACKGROUND_COLOR;
//         ctx.fillRect(0, 0, CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.HEIGHT);
//     }, []);

//     const drawNet = useCallback((ctx: CanvasRenderingContext2D) => {
//         ctx.fillStyle = 'white';
//         const netX = CANVAS_CONFIG.WIDTH / 2 - 1;

//         for (let i = 0; i < CANVAS_CONFIG.HEIGHT; i += CANVAS_CONFIG.NET_GAP) {
//             ctx.fillRect(netX, i, 2, CANVAS_CONFIG.NET_SEGMENT_HEIGHT);
//         }
//     }, []);

//     const drawPaddle = useCallback((ctx: CanvasRenderingContext2D, paddle: RenderableObject) => {
//         ctx.save();
//         ctx.shadowBlur = CANVAS_CONFIG.PADDLE_GLOW_BLUR;
//         ctx.shadowColor = CANVAS_CONFIG.PADDLE_GLOW_COLOR;
//         ctx.fillStyle = 'white';
//         ctx.fillRect(paddle.x, paddle.y, paddle.w!, paddle.h!);
//         ctx.restore();
//     }, []);

//     const drawBall = useCallback((ctx: CanvasRenderingContext2D, ballObj: RenderableObject) => {
//         ctx.save();
//         ctx.shadowBlur = CANVAS_CONFIG.BALL_GLOW_BLUR;
//         ctx.shadowColor = CANVAS_CONFIG.BALL_GLOW_COLOR;
//         ctx.fillStyle = 'white';
//         ctx.beginPath();
//         ctx.arc(ballObj.x, ballObj.y, ballObj.r!, 0, Math.PI * 2, false);
//         ctx.closePath();
//         ctx.fill();
//         ctx.restore();
//     }, []);


//     useEffect(() => {

//         const cvs = canvasRef.current;
//         if (!cvs) return;

//         const ctx = cvs.getContext('2d');
//         if (!ctx) return;

//         ws.current = new WebSocket('ws://localhost:8000/ws/game/localGame/');

//         ws.current.onopen = () => {
//             console.log('WebSocket Client Connected');
//         };

//         ws.current.onerror = (error) => {
//             console.log('WebSocket error:', error);
//         };

//         ws.current.onmessage = (e) => {
//             const data = JSON.parse(e.data);
//             const newBallState = data['gameState'].BALL;
//             const newPlayersPositions = data['gameState'].PLAYERS;

//             updateBall(newBallState);
//             updatePaddles(newPlayersPositions["PLAYER1"], newPlayersPositions["PLAYER2"]);
//             render();
//         }

//         const handleKey = (e: KeyboardEvent, isPressed: boolean) => {
//             const validKeys = new String(["ArrowUp", "ArrowDown", "w", "s"]);
//             // e.preventDefault();
//             if (currentStateRef.current === "PLAY" && validKeys.includes(e.key)) {
//                 if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//                     ws.current.send(JSON.stringify({ "Action": "MovePaddles", "key": e.key, "isPressed": isPressed }));
//                 }
//                 setKeyPressed(e.key, isPressed);
//             }
//         };

//         const keydownHandler = (e: KeyboardEvent) => handleKey(e, true);
//         const keyupHandler = (e: KeyboardEvent) => handleKey(e, false);

//         const render = () => {
//             ctx.clearRect(0, 0, CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.HEIGHT);
//             drawTable(ctx);
//             drawNet(ctx);
//             drawPaddle(ctx, player1Ref.current);
//             drawPaddle(ctx, player2Ref.current);
//             drawBall(ctx, ballRef.current);
//         };

//         document.addEventListener('keydown', keydownHandler);
//         document.addEventListener('keyup', keyupHandler);

//         return () => {

//             document.removeEventListener('keydown', keydownHandler);
//             document.removeEventListener('keyup', keyupHandler);
//             console.log("GameCanvas cleanup");
//             if (ws.current)
//                 ws.current.close();
//         };
//     }, []);

//     return (
//         <canvas ref={canvasRef} width={CANVAS_CONFIG.WIDTH} height={CANVAS_CONFIG.HEIGHT} className="border-cyan-200 rounded-sm" />
//     );
// }

// export default GameCanvas;
