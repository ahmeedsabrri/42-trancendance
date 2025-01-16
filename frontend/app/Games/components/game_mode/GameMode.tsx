import Image from "next/image";
import { useGameStore } from "../../store/GameStore";

interface GameMode {
    mode: string;
    type: 'local' | 'online';
    src: string;
}

const Mode: React.FC<GameMode> = ({ mode, type, src }) => {
    const { selectedMode, setGameMode } = useGameStore();

    const isSelected = selectedMode === type;

    return (
        <div 
            className={`flex flex-col justify-center items-center w-[100%] min-h-[75%] rounded-[60px] backdrop-blur-3xl cursor-pointer hover:transition-all duration-100
                ${isSelected
                    ? 'bg-white/25 border-2 border-white/50'
                    : 'bg-white/35 hover:bg-white/25'
                }`}
            onClick={() => setGameMode(type)}
        >
            <h1 className="text-6xl text-white mb-16 font-bold">{mode}</h1>
            <Image
                src={src}
                alt="mode"
                width={300}
                height={300}
            />
        </div>
    )
}

export default Mode;