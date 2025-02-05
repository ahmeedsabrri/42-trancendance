"use client";

import React, { useEffect, Dispatch, SetStateAction } from "react";
import { UserProfile } from "../context/ChatContext";


const Auth = () => {

    console.log("Auth");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        for (let [key, value] of formData.entries()) {
            console.log({key, value});
        }
        const FormUser = {
            user: {
                username: formData.get("username"),
                email: formData.get("email"),
                password: formData.get("password")
            },
            picture: "",
            status: false
        };

        const getUser = async () => {
            const response = await fetch("http://localhost:8000/chat/new_user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(FormUser)
            });
            setUserProfile(await response.json());
            
        };
        getUser();
    }

    useEffect(() => {
        if (UserProfile)
        {
            console.log("User Profile:");
            console.log(UserProfile);
        }
    }, [UserProfile])

    return (
        <form onSubmit={handleSubmit} className="w-3/4 h-3/4 rounded-3xl backdrop-blur-xl border shadow-2xl flex items-center justify-center">
            <div className="p-20 rounded-3xl shadow-input_inner flex gap-2 items-center justify-center flex-col">
                <label className="text-white text-xl">Username:</label>
                <input name="username" className="bg-search_color rounded-md focus:bg-white outline-none px-2 text-black shadow-xl border-white border"></input>
                <label className="text-white text-xl">email:</label>
                <input name="email" type="email" className="bg-search_color rounded-md focus:bg-white outline-none px-2 text-black shadow-xl border-white border"></input>
                <label className="text-white text-xl">password:</label>
                <input name="password" type="password" className="bg-search_color rounded-md focus:bg-white outline-none px-2 text-black shadow-xl border-white border"></input>
                <button type="submit" className="mt-2 border font-bold rounded-md p-1 px-2 hover:bg-white hover:text-black hover:border-search_color active:bg-search_color shadow-xl">Sign Up</button>
            </div>
        </form>
    )

}

export default Auth;