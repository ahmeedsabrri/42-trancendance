'use client'
import React, { useEffect, useRef, useState } from 'react';

import Image from "next/image";
import FindOpponent from '../FindOpponent/FindOpponent'
import { IMAGES } from "@/public/index";
import '../board.css'

const TicTac = () => {
    
    const images = {
        X : '/game/images/X.png',
        O : '/game/images/O.png',
        WINNER : '/game/images/winner.png' 
    }

    type CellValue = string | '';

    interface User{
        username : null | string,
        opponent_username : null | string,
        mark : 'X' | 'O'  | null
    }

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
        right_score : 0
    });

    const socket = useRef<null | WebSocket>(null);

    const updateBoard = useRef<CellValue[]>(board);

    useEffect(() => {
        socket.current = new WebSocket('ws://localhost:8000/ws/TicTac/local/');

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
                setGameOver(true);
                message.winner === 'left_player' ? alert('X player won') : alert('O player won');
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

    if (!isInGame)
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
                    <div className="w-full h-full rounded-3xl relative flex flex-col justify-start items-center">
                        <div className="w-full flex-start gap-y-8 px-6 mt-4">
                            <div className="w-full h-[90px] flex justify-between items-center">
                                <div className="w-[500px] flex justify-between items-center relative">
                                    <span className="text-8xl font-normal text-white ">{0}</span>
                                    <span className="text-4xl font-normal text-white absolute left-56">vs</span>
                                    <span className="text-8xl font-normal text-white ">{0}</span>
                                </div>
                                { gameOver ?
                            (
                            <div className='winner-container'>
                                <img src={images.WINNER}/>
                            </div>)
                        :   (
                            <div className='tictac-container'>
                                <div className='tictac-board'>
                                {board.map((cell, index) =>
                                    <div key={index} className='cell-styling' onClick= {() => handleClick(index)}>
                                        <img src={(board[index] !== '') ? board[index] : null} />
                                    </div>)}
                                </div>
                                </div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </main >
        </div >
    );
}

export default TicTac
