'use client'

import Image from "next/image";
import Link from "next/link";
import CustomButton from "../utils/CutsomButton";
import { useGameStore } from "../../store/GameStore";
import { useUserStore } from "@/app/store/store";
import { useEffect } from "react";

interface GamePanelProps {
  gameType: 'pingpong' | 'tictactoe';
}

const GamePanel = ({ gameType }: GamePanelProps) => {

  const { currentGame, isReversed, showContent, gameContent, handleGameSwitch, handleCurrentState, label } = useGameStore();
  const { user } = useUserStore();
  const { resetTournamentPlayer, setTournamentMatch, setIsTournament, resetInvitedId } = useGameStore()

  const isActive = gameType === 'pingpong' ? !isReversed : isReversed;
  const content = gameContent[gameType];

  useEffect(() => {
    resetInvitedId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`transition-all duration-700 ease-in-out ${isActive
        ? 'w-full rounded-3xl'
        : 'w-14 rounded-lg cursor-pointer overflow-hidden'
        } h-full relative`}
      onClick={!isActive ? handleGameSwitch : undefined}
    >
      <Image
        src={content.image}
        alt={content.title}
        fill
        className="object-cover rounded-3xl -z-10"
        quality={100}
        priority
      />
      {isActive && (
        <div className={`w-full h-full flex flex-col justify-between p-14 items-center transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'
          }`}>
          <div className="w-full h-full flex justify-between items-start ">
            <div className="text-white">
              <h1 className="text-8xl font-bold mb-6">
                {content.title}
              </h1>
              <h1 className="max-w-[600px] leading-relaxed text-lg">
                {content.description}
              </h1>
            </div>
            <div className="text-white text-4xl font-bold mt-3">
              <h1>Let&apos;s <span className="text-blue-200">Go</span> {user?.first_name} {user?.last_name}</h1>
            </div>
          </div>
          <div className="w-full h-full flex justify-between items-end">
            <div className="flex justify-center items-center gap-x-5">
              <Link href={content.gameLink}>
                <CustomButton
                  label="START"
                  onClick={() => {
                    if (label === "PAUSE") {
                      handleCurrentState();
                    }
                    setIsTournament(false);
                    setTournamentMatch(null);
                  }}
                  className="text-white text-4xl font-bold bg-gray-800 bg-opacity-30 backdrop-blur-xl px-16 py-5 hover:bg-opacity-10 rounded-3xl border border-white/10"
                />
              </Link>
              {
                currentGame === "pingpong" &&
                <Link href="/tournament/local">
                  <CustomButton
                    onClick={() => resetTournamentPlayer()}
                    label="TOURNAMENT"
                    className="text-white text-4xl font-bold bg-gray-800 bg-opacity-30 backdrop-blur-xl px-8 py-5 hover:bg-opacity-10 rounded-3xl border border-white/10"
                  />
                </Link>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePanel; 