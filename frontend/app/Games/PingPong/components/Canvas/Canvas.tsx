'use client'

import GameCanvas from "./GameCanvas"
import Link from "next/link"
import CustomButton from "../../../components/utils/CutsomButton"
import { useGameStore } from "../../../store/GameStore"

const Canvas = () => {

    const { label, handleCurrentState } = useGameStore();

    return (
        <div className="flex justify-center flex-col items-center p-4 bg-gray-500  bg-opacity-30 backdrop-blur-xl  rounded-xl mt-2" >
            <GameCanvas />
            <div className='flex justify-between items-center w-[100%]'>

                <Link href={"/Games"}>
                    <CustomButton
                        label="EXIT"
                        className="mt-5 text-white text-4xl font-bold bg-gray-800 bg-opacity-30 backdrop-blur-xl px-16 py-6 hover:bg-opacity-40 rounded-3xl outline-none"
                    />
                </Link>
                <CustomButton
                    label={label}
                    onClick={() => { handleCurrentState() }}
                    className="mt-5 text-white text-4xl font-bold bg-gray-800 bg-opacity-30 backdrop-blur-xl px-16 py-6 hover:bg-opacity-40 rounded-3xl outline-none"
                />
            </div>
        </div>
    )
}

export default Canvas;