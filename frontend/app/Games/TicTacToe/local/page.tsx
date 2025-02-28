"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IMAGES } from "@/public/index";
import Avatar from "../../components/navbar/profilebar/Avatar";
import Winner from "../../PingPong/components/VictoryCard";
import ExitButton from "../ExitButton/ExitButton";
import { useGameStore } from "../../store/GameStore";

const TicTac = () => {
  type CellValue = string | null;

  interface Scores {
    left_score: number;
    right_score: number;
  }

  const [isInGame, setIsInGame] = useState<false | true>(false);
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [gameOver, setGameOver] = useState<true | false>(false);
  const [scores, setScores] = useState<Scores>({
    left_score: 0,
    right_score: 0,
  });
  const winner = useRef<string>("");
  const socket = useRef<null | WebSocket>(null);
  const { GameBoardColor } = useGameStore();
  const base_wws_url = process.env.NEXT_PUBLIC_WSS_URL
  useEffect(() => {
    socket.current = new WebSocket(`${base_wws_url}/TicTac/local/`);
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.action) {
        case "game_started":
          setIsInGame(true);
          break;

        case "score_update":
          const scoreObj: Scores = { left_score: 0, right_score: 0 };
          scoreObj.left_score = message.left_score;
          scoreObj.right_score = message.right_score;
          setScores(scoreObj);
          resetGame();
          break;

        case "board_update":
          setBoard(message.board);
          break;

        case "player_won":
          if (message.winner === "left_player")
            winner.current = "Player 1";
          else
            winner.current = "Player2";
          socket.current?.close();
          setGameOver(true);
          break;

        case "draw":
          resetGame();
      }
    };
    return () => {
      socket.current?.close();
    };
  }, []);

  function resetGame() {
    const resetBoard = Array(9).fill(null);
    setBoard([...resetBoard]);
  }
  function handleClick(index: number): void {
    if (board[index] !== null) return;
    const data = {
      'position': index,
    };
    socket.current?.send(JSON.stringify(data));
  }

  if (!isInGame)
  {
    console.log('always here')
    return;
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
                  <Avatar width={70} height={70} avatar={null} />
                  <span className="text-white font-semibold">Player 1</span>
                </div>
                <div className="w-[500px] flex justify-between items-center relative">
                  <span className="text-8xl font-normal text-white ">
                    {scores.left_score}
                  </span>
                  <span className="text-4xl font-normal text-white absolute left-56">
                    vs
                  </span>
                  <span className="text-8xl font-normal text-white ">
                    {scores.right_score}
                  </span>
                </div>
                <div className="flex justify-center items-center gap-x-3">
                  <span className="text-white font-semibold">Player 2</span>
                  <Avatar width={70} height={70} avatar={null} />
                </div>
              </div>
            </div>
            {gameOver ? (
              <Winner
                winner={winner.current}
                winner_avatar={null}
                reason="GAME FINISHED"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center flex-col">
                <div
                  className={` ${GameBoardColor} h-full w-2/6 rounded-[46px] shadow-[0_4px_0_rgba(0,0,0,0.25)] flex items-center justify-center select-none`}
                >
                  <div className="grid grid-cols-3 grid-rows-3 overflow-hidden border border-white/50 rounded-[46px] w-[96%] h-[96%]">
                    {board.map((cell, index) => (
                      <div
                        key={index}
                        className="flex justify-center items-center border border-white/50 transition-all duration-500 hover:cursor-pointer"
                        onClick={() => handleClick(index)}
                      >
                        {cell !== null ? (
                          <Image
                            src={cell === 'X' ? IMAGES.X : IMAGES.O}
                            alt="cell"
                            height={100}
                            width={100}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <ExitButton />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicTac;