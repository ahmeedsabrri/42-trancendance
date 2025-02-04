'use client'

import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import Avatar from '../../components/navbar/profilebar/Avatar';
import Winner from '../../PingPong/components/VictoryCard';
import CustomButton from '../../components/utils/CutsomButton';
import FindOpponent from '../FindOpponent/FindOpponent';
import { IMAGES } from "@/public/index";
import Scores from '../../PingPong/components/Scores';
import { useGameStore } from '../../store/GameStore';
import useWebSocket from 'react-use-websocket';
import ExitButton from '../ExitButton/ExitButton';

const TicTac = () => {
    type winner = {
        username: string | null,
        avatar: string | null
    };
    type CellValue = string | '';

    interface User {
        username: null | string,
        opponent_username: null | string,
    }
    interface User {
        username: null | string,
        opponent_username: null | string,
        user_avatar: string | null,
        opponent_avatar: string | null,
        mark: 'X' | 'O' | null,
        winner: winner
    }

    interface Scores {
        score: number,
        opponent_score: number
    }

    const WS_URL = "wss://localhost/ws/TicTac/remote/";

    const {
        sendJsonMessage,
        lastJsonMessage,
        readyState,
    } = useWebSocket<any>(WS_URL, {
        shouldReconnect: (closeEvent) => false,
        onError: (event) => console.log('WebSocket error:', event),
        onOpen: () => console.log('WebSocket connected'),
        onClose: () => console.log('WebSocket disconnected'),
    });

    const { GameBoardColor } = useGameStore()
    const [isInGame, setIsInGame] = useState<false | true>(false);
    const [isMyTurn, setIsMyTurn] = useState<false | true>(false);
    const [board, setBoard] = useState<CellValue[]>(Array(9).fill(''));
    const [gameOver, setGameOver] = useState<true | false>(false);
    const [isWaiting, setIsWaiting] = useState<true | false>(true);
    const [scores, setScores] = useState<Scores>({
        score: 0,
        opponent_score: 0
    });


    const user = useRef<User>({
        username: null,
        user_avatar: null,
        opponent_username: null,
        opponent_avatar: null,
        mark: null,
        winner: { username: null, avatar: null }
    });
    const updateBoard = useRef<CellValue[]>(board);

    useEffect(() => {
        if (!lastJsonMessage) return;
        switch (lastJsonMessage.action)
        {
            case 'identify_players':
                user.current.username = lastJsonMessage.username;
                user.current.opponent_username = lastJsonMessage.opponent_username;
                user.current.user_avatar = lastJsonMessage.user_avatar;
                user.current.opponent_avatar = lastJsonMessage.opponent_avatar;
                user.current.mark = lastJsonMessage.mark;
                break;

            case 'game_started':
                setIsInGame(true);
                setIsWaiting(false);
                lastJsonMessage.turn ? setIsMyTurn(true) : setIsMyTurn(false);
                break;

            case 'score_update' :
                let scoreObj: Scores = { score: 0, opponent_score: 0 };
                lastJsonMessage.sender === user.current.username
                ? (scoreObj.score = lastJsonMessage.score, scoreObj.opponent_score = lastJsonMessage.opponent_score)
                : (scoreObj.score = lastJsonMessage.opponent_score, scoreObj.opponent_score = lastJsonMessage.score);
                setScores(scoreObj);
                resetGame();
                break;

            case 'board_update':
                setBoard([...lastJsonMessage.board]);
                setIsMyTurn(true);
                break;

            case 'player_won':
                user.current.winner.username = lastJsonMessage.sender;
                user.current.winner.avatar = lastJsonMessage.avatar;
                setGameOver(true);
                break;

            case 'draw':
                resetGame();
        }
    }
        , [lastJsonMessage])


    function resetGame() {
        const resetBoard = Array(9).fill('');
        setBoard([...resetBoard]);
        user.current.mark === 'X' ? setIsMyTurn(true) : setIsMyTurn(false);
    }

    function handleClick(index: number): void {
        if (!isMyTurn)
            return;
        if (board[index] !== '')
            return;
        let newBoard: CellValue[] = [...board];
        user.current.mark === 'X' ? newBoard[index] = IMAGES.X : newBoard[index] = IMAGES.O;
        setBoard(newBoard);
        updateBoard.current = [...newBoard];
        const data = {
            "action": "board_update",
            "position": index,
            "board": updateBoard.current,
            "mark": user.current.mark
        }
        sendJsonMessage(data);
        setIsMyTurn(false);
    }

    if (isWaiting)
        return <FindOpponent />

    return (
        <div className="py-1 bg-gray-500  bg-opacity-30 backdrop-blur-xl w-full h-full flex flex-col justify-center items-center rounded-3xl overflow-hidden px-2">
            <main className="w-full h-full flex justify-center items-center gap-x-2 p-2 relative">
                <div className="w-full h-full rounded-3xl relative flex flex-col justify-center items-center bg-black bg-opacity-20 pb-5">
                    <Image
                        src={IMAGES.pongTable}
                        alt="pong game"
                        fill
                        className="object-cover rounded-3xl -z-10"
                        quality={100}
                        priority
                    />
                    <div className="w-full h-full rounded-3xl relative flex flex-col justify-start items-center gap-y-16">
                        <div className="w-full flex-start gap-y-8 px-6 mt-4 ">
                            <div className="w-full h-[90px] flex justify-between items-center">
                                <div className="flex justify-center items-center gap-x-3">
                                    <Avatar width={70} height={70} avatar={user.current.user_avatar} />
                                    <div className='flex justify-center items-center flex-col gap-1 h-full'>
                                        <span className="text-white font-semibold my-1">
                                            {user.current.username}
                                        </span>
                                        {isMyTurn && <div className='w-5 h-5 rounded-full bg-green-500'></div>}
                                    </div>
                                </div>
                                <div className="w-[500px] flex justify-between items-center relative">
                                    <span className="text-8xl font-normal text-white ">{scores.score}</span>
                                    <span className="text-4xl font-normal text-white absolute left-56">vs</span>
                                    <span className="text-8xl font-normal text-white ">{scores.opponent_score}</span>
                                </div>
                                <div className="flex justify-center items-center gap-x-3">
                                    <div className='flex justify-center items-center flex-col gap-1'>
                                        <span className="text-white font-semibold">
                                            {user.current.opponent_username}
                                        </span>
                                        {!isMyTurn && <div className='w-5 h-5 rounded-full bg-green-500'></div>}
                                    </div>
                                    <Avatar width={70} height={70} avatar={user.current.opponent_avatar} />
                                </div>
                            </div>
                        </div>
                        {gameOver ?
                            <>
                                <Winner winner={user.current.winner.username} winner_avatar={user.current.winner.avatar} />
                                <ExitButton/>
                            </>
                            : (
                                <div className={` ${GameBoardColor} h-full w-2/6 rounded-[46px] shadow-[0_4px_0_rgba(0,0,0,0.25)] flex items-center justify-center select-none`}>
                                    <div className="grid grid-cols-3 grid-rows-3 overflow-hidden border border-white/50 rounded-[46px] w-[96%] h-[96%] m-[10px]">
                                        {board.map((cell, index) =>
                                            <div key={index} className="flex justify-center items-center object-contain border border-white/50 transition-all duration-500 hover:cursor-pointer" onClick={() => handleClick(index)}>
                                                <img src={(board[index] !== '') ? board[index] : null} />
                                            </div>)}
                                    </div>
                                </div>)}
                    </div>
                </div>
            </main >
        </div >
    );
}

export default TicTac;