'use client'
import React, { useEffect, useRef, useState } from 'react';

import Image from "next/image";
import FindOpponent from '../FindOpponent/FindOpponent'
import { IMAGES } from "@/public/index";
import Avatar from '../../components/navbar/profilebar/Avatar';
import Winner from '../../PingPong/components/VictoryCard'
import Link from 'next/link';
import ExitButton from '../ExitButton/ExitButton'


const TicTac = () => {
    
    const images = {
        X : '/game/images/X.png',
        O : '/game/images/O.png',
    }

    type CellValue = string | '';


    interface Scores{
        left_score : number,
        right_score: number
    }

    const [isInGame, setIsInGame] = useState<false | true>(false);
    const [board, setBoard] = useState<CellValue[]>(Array(9).fill(''));
    const [gameOver, setGameOver] = useState<true | false>(false);
    const [mark, setMark] = useState<'X' | 'O'>('X')
    const [scores, setScores] = useState<Scores>({
        left_score: 0,
        right_score : 0,
    });
    const winner = useRef<string>('')
    const socket = useRef<null | WebSocket>(null);

    const updateBoard = useRef<CellValue[]>(board);

    useEffect(() => {
        socket.current = new WebSocket('wss://localhost/ws/TicTac/local/');

        socket.current.onmessage = (event) =>{
            const message = JSON.parse(event.data);
            if (message.action ==='game_started')
                setIsInGame(true);
            else if (message.action === 'score_update')
            {
                let scoreObj : Scores = {left_score: 0, right_score : 0};
                scoreObj.left_score = message.left_score;
                scoreObj.right_score = message.right_score;
                setScores(scoreObj);
                setMark('X')
                resetGame();
            }
            else if (message.action === 'player_won')
            {
                socket.current?.close();
                message.winner === 'left_player' ? winner.current = "Player 1" : winner.current = "Player 2";
                setGameOver(true);
            }
            else if (message.action === 'draw')
                resetGame();
        }
        return () => {
            socket.current?.close();
        }
    }
        ,[])

    function resetGame()
    {
        const resetBoard = Array(9).fill('');
        setBoard([...resetBoard]);
    }
    function handleClick(index: number) : void{
        if (gameOver)
            return alert('Game is Over, Start another One');
        if (board[index] !== '')
                return;
        else
        {
            let newBoard: CellValue[] = [...board];
            mark === 'X' ? newBoard[index] = images.X : newBoard[index]=images.O 
            mark === 'X' ? setMark('O') : setMark('X')
            setBoard(newBoard);
            updateBoard.current = [...newBoard];
            const data = {
                "action" : "board_update",
                "position": index,
                "board" : updateBoard.current,
                "mark": mark
            }
            socket.current?.send(JSON.stringify(data));
        }
    }

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
                                    <Avatar width={70} height={70} avatar={null}/>
                                    <span className="text-white font-semibold">
                                        player_1
                                    </span>
                                </div>
                                <div className="w-[500px] flex justify-between items-center relative">
                                    <span className="text-8xl font-normal text-white ">{scores.left_score}</span>
                                    <span className="text-4xl font-normal text-white absolute left-56">vs</span>
                                    <span className="text-8xl font-normal text-white ">{scores.right_score}</span>
                                </div>
                                <div className="flex justify-center items-center gap-x-3">
                                    <span className="text-white font-semibold">
                                        player_2
                                    </span>
                                    <Avatar width={70} height={70} avatar={null}/>
                                </div>
                            </div>
                        </div>
                        { gameOver ?
                            (
                            <>
                                <Winner winner={winner.current} winner_avatar={null}/>
                                <ExitButton/>
                            </>
                            )
                        :   (
                            <div className="bg-[rgba(0,225,90,1)] h-full w-2/6 rounded-[46px] shadow-[0_4px_0_rgba(0,0,0,0.25)] flex items-center justify-center select-none">
                                <div className="grid grid-cols-3 grid-rows-3 overflow-hidden border border-white/50 rounded-[46px] w-[96%] h-[96%] m-[10px]">
                                {board.map((cell, index) =>
                                    <div key={index} className="flex justify-center items-center object-contain border border-white/50 transition-all duration-500 hover:bg-[#0bbe53] hover:cursor-pointer" onClick= {() => handleClick(index)}>
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

export default TicTac
