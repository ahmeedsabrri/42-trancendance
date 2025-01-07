'use client'

import Avatar from "../../components/navbar/profilebar/Avatar";

interface ScoresProps {
    mainPlayerScore: React.RefObject<number>,
    secondPlayerScore: React.RefObject<number>,
    mode: string,
}

const Scores: React.FC<ScoresProps> = ({mainPlayerScore, secondPlayerScore, mode}) => {
    
    return (
        <div className="w-full flex-start gap-y-8 px-6 mt-4">
            <div className="w-full h-[90px] flex justify-between items-center">
                <div className="flex justify-center items-center gap-x-3">
                    <Avatar width={70} height={70} />
                    <span className="text-white font-semibold">
                        {mode === 'local' ? 'Player 1' : 'khalid zerri'}
                    </span>
                </div>
                <div className="w-[500px] flex justify-between items-center relative">
                    <span className="text-8xl font-normal text-white ">{mainPlayerScore.current}</span>
                    <span className="text-4xl font-normal text-white absolute left-56">vs</span>
                    <span className="text-8xl font-normal text-white ">{secondPlayerScore.current}</span>
                </div>
                <div className="flex justify-center items-center gap-x-3">
                    <span className="text-white font-semibold">
                        {mode === 'local' ? 'Player 2' : 'Anass raji afoua'}
                    </span>
                    <Avatar width={70} height={70} />
                </div>
            </div>
        </div>
    )
}

export default Scores;