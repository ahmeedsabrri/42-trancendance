'use client'
import { useState, useEffect, useRef } from 'react'

import Image from "next/image";
import { useParams } from 'next/navigation';
import Avatar from '../../components/navbar/profilebar/Avatar';
import CustomButton from '../../components/utils/CutsomButton';
import FindOpponent from '../FindOpponent/FindOpponent'
import { IMAGES } from "@/public/index";
import Scores from '../../PingPong/components/Scores';
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
        score: number,
        opponent_score : number
    }

    const [isInGame, setIsInGame] = useState<false | true>(false);
    const [isMyTurn, setIsMyTurn] = useState<false | true>(false);
    const [board, setBoard] = useState<CellValue[]>(Array(9).fill(''));
    const [gameOver, setGameOver] = useState<true | false>(false);
    const [isWaiting, setIsWaiting] = useState<true | false>(true);
    const [scores, setScores] = useState<Scores>({
        score: 0,
        opponent_score : 0
    });

    const socket = useRef<null | WebSocket>(null);

    const user = useRef<User>({
        username : null,
        opponent_username : null,
        mark : null
    });
    const updateBoard = useRef<CellValue[]>(board);

    useEffect(() => {
        socket.current = new WebSocket('ws://localhost:8000/ws/TicTac/remote/');

        socket.current.onmessage = async (event) =>{
            const message = await JSON.parse(event.data);
            console.log(message)
            if (message.action === 'identify_players')
            {
                user.current.username = message.username;
                user.current.opponent_username = message.opponent_username;
                user.current.mark = message.mark;
            }
            else if (message.action ==='game_started')
            {
                setIsInGame(true);
                setIsWaiting(false);
                message.turn ? setIsMyTurn(true) : setIsMyTurn(false);
            }
            else if (message.action === 'score_update')
            {
                let scoreObj : Scores = {score: 0, opponent_score : 0};
                message.sender === user.current.username 
                ? (scoreObj.score = message.score, scoreObj.opponent_score = message.opponent_score)
                : (scoreObj.score = message.opponent_score, scoreObj.opponent_score = message.score);
                setScores(scoreObj);
                resetGame();
            }
            else if (message.action === 'board_update')
            {
                setBoard([...message.board]);
                setIsMyTurn(true);
            }
            else if (message.action === 'player_won')
            {
                message.sender === user.current.username
                ? alert('Congrats, you have won the game')
                : alert('You lost, Hard luck');
                socket.current?.close();
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
        user.current.mark === 'X' ? setIsMyTurn(true) : setIsMyTurn(false);
    }
    function handleClick(index: number) : void{
        if (gameOver)
            return alert('Game is Over, Start another One');
        if (!isInGame)
            return alert('waiting for opponent to join!');
        if (!isMyTurn)
            return alert('wait for your turn!');
        if (board[index] !== '')
                return;
            let newBoard: CellValue[] = [...board];
            user.current.mark === 'X' ? newBoard[index] = images.X : newBoard[index] = images.O;
            setBoard(newBoard);    
            updateBoard.current = [...newBoard];
            const data = {
                "action" : "board_update",
                "position": index,
                "board" : updateBoard.current,
                "mark": user.current.mark
            }
            socket.current?.send(JSON.stringify(data));
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
                                    <Avatar width={70} height={70} />
                                    <span className="text-white font-semibold">
                                        {user.current.username}
                                    </span>
                                </div>
                                <div className="w-[500px] flex justify-between items-center relative">
                                    <span className="text-8xl font-normal text-white ">{0}</span>
                                    <span className="text-4xl font-normal text-white absolute left-56">vs</span>
                                    <span className="text-8xl font-normal text-white ">{0}</span>
                                </div>
                                <div className="flex justify-center items-center gap-x-3">
                                    <span className="text-white font-semibold">
                                        {user.current.opponent_username}
                                    </span>
                                    <Avatar width={70} height={70} />
                                </div>
                            </div>
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
            </main >
        </div >
    );
}

export default TicTac;
