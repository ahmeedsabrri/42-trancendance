import GamePanel from "@/app/Games/components/gamePannel/GamePanel";

const Game = () => {
    return (
        <div className="size-full flex justify-center items-center overflow-hidden gap-2">
            <GamePanel gameType="pingpong" dashboard={true}/>
		    <GamePanel gameType="tictactoe" dashboard={true}/>
        </div>
    )
}

export default Game;