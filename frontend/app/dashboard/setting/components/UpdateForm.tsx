"use client";

import { useUserStore } from "@/app/store/store";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"

type FormData = {
    firstName: string;
    lastName: string;
    password: string;
};
export default function UpdateForm() {
    const { user } = useUserStore();
    const { register, handleSubmit } = useForm<FormData>({
        defaultValues: {
            firstName: "",
            lastName: "",
            password: "",
        }
    });
    const onSubmit = handleSubmit((data) => {
        if (!data.firstName) {
            data.firstName = user?.first_name || "";
        }
        if (!data.lastName) {
            data.lastName = user?.last_name || "";
        }
        console.log(data);
    });
    return (
        <>
            <h1 className="text-white font-bold">Update Profile</h1>
            <form className="w-full h-2/3 flex flex-col items-center justify-center gap-y-8"  onSubmit={onSubmit}>
                <div className="w-full h-2/3 flex flex-col items-center justify-center gap-4 ">
                    <div className="w-full h-1/3 flex flex-row items-center gap-16">
                        <label htmlFor="firstName" className="text-white text-sm opacity-50">Firstname</label>
                        <input value={user?.first_name} type="text" {...register("firstName")} className="bg-transparent text-white/25 backdrop-blur-lg p-2 rounded-full w-[250px] h-[45px] m-2 outline-slate-400 drop-shadow-2xl shadow-2xl border-b-2 border-white/10" />
                    </div>
                    <div className="w-full h-1/3 flex flex-row items-center gap-16">
                        <label htmlFor="lastName" className="text-white text-sm opacity-50 ">Lastname</label>
                        <input value={user?.last_name} type="text" {...register("lastName")} className=" bg-transparent  text-white/25 backdrop-blur-lg p-2 rounded-full w-[250px] h-[45px] m-2 outline-slate-400 drop-shadow-2xl shadow-2xl border-b-2 border-white/10" />
                    </div>
                    <div className="w-full h-1/3 flex flex-row items-center gap-16">
                        <label htmlFor="password" className="text-white text-sm opacity-50">Password</label>
                        <input  type="password" {...register("password")} className="bg-transparent backdrop-blur-lg p-2  text-white/25 rounded-full w-[250px] h-[45px] m-2 outline-slate-400 drop-shadow-2xl shadow-2xl border-b-2 border-white/10" />
                    </div>
                </div>
                <Button type="submit" className="transition ease-in-out delay-150 bg-black text-white font-bold bg-black/15 backdrop-blur-lg  rounded-full p-2 my-2 w-[250px] h-[50px] hover:bg-zinc-900 drop-shadow-2xl">Update</Button>
            </form>
        </>
    );
}