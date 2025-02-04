'use client'
import { useGameStore } from "@/app/Games/store/GameStore";
import React, { useState } from "react"
// import './SubmitName.css'

interface SubmitNameProps {
    onClose: () => void;
    onSubmit: (name: string) => void;
}

interface Error{
    Error: string,
    is_Error: boolean
}

const SubmitName: React.FC<SubmitNameProps> = ({ onClose, onSubmit }) => {

    const [inputName, setInputName] = useState<string>('');
    const {tournament_players} = useGameStore()
    const [error, setError] = useState<Error>({Error: '', is_Error: false});

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputName(event.target.value);
        setError({Error:'',is_Error:false})
      };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const name =  inputName.trim()
        if (name.length < 3 || name.length > 10)
            setError({Error: 'Error; username length must be 3-->10 characters!', is_Error: true})
        else if (name !== '' && !tournament_players.includes(name))
            onSubmit(name);
        else
            setError({Error: 'Error: username already used!', is_Error: true})
      };
    return (
            <>
                <div className="fixed top-0 left-0 w-full h-full bg-transparent z-[998] pointer-events-auto" onClick={onClose}></div>
                <div className={`absolute -left-[0.5px] w-[370px] ${error.is_Error ? `h-[200px]` : `h-[150px]`} rounded-3xl bg-gray-700 backdrop-blur-[80px] flexitems-center justify-center flex-col overflow-hidden z-[999]`}>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center pt-3 gap-y-3">
                        <input className="w-[350px] h-[65px] bg-[rgba(164,110,156,0.3)] backdrop-blur-[100px] border-[0.5px] border-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.25)] outline-none text-white pl-[20px] text-[16px] placeholder-[rgba(255,255,255,0.25)]"
                            type="text" placeholder="Enter name" onChange={handleInputChange} required/>
                        <div className="text-white w-full flex items-center justify-between px-3">
                            <button className="w-[80px] h-[50px] bg-red-800 rounded-2xl border-none text-white font-bold cursor-pointer transition-opacity duration-200 hover:opacity-90" onClick={onClose}>CANCEL</button>
                            <button className="w-[80px] h-[50px] bg-green-700 rounded-2xl border-none text-white font-bold cursor-pointer transition-opacity duration-200 hover:opacity-90" type="submit">SUBMIT</button>
                        </div>
                        {error.is_Error && <p className="font-bold text-red-500 flex justify-center items-center w-full text-center">{error.Error}</p>}
                    </form>
                </div>
            </>
        )
}

export default SubmitName;