import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthActions } from "../utils";
import { useRouter } from "next/navigation";


type FormData = {
    username: string;
    password: string;
};

export default function SignInForm() {
    const [formData, setFormData] = useState<FormData>({
        username: "",
        password: "",
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState: FormData) => ({
          ...prevState,
          [name]: value,
        }));
    };
    const {
        handleSubmit,
        formState: { errors },
        setError,
      } = useForm<FormData>();
    
      const router = useRouter();
    
      const { login } = AuthActions();
    
      const onSubmit = () => {
        login(formData.username, formData.password)
          .then(() => {
            console.log("Logged in successfully");
            router.push("/");
          })
          .catch((err) => {
            console.log(err);
            setError("root", { type   : "manual", message: err.data.message}); 
          });
      };
    return (
      <form className="space-y-4 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-white mb-6">Sign In</h2>
        <div>
          <input
            type="text"
            name="username"
            className="placeholder-white placeholder-opacity-50 bg-transparent backdrop-blur-lg p-2 rounded-full w-[250px] h-[50px] m-2 outline-slate-400 drop-shadow-2xl shadow-2xl"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
             className="placeholder-white placeholder-opacity-50 bg-transparent backdrop-blur-lg p-2 rounded-full w-[250px] h-[50px] m-2 outline-slate-400 drop-shadow-2xl shadow-2xl"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button
            type="submit"
            className="transition ease-in-out delay-150 bg-black text-white font-bold bg-transparent backdrop-blur-lg  hover:bg-zinc-900 rounded-full p-2 my-2 w-[250px] h-[50px]  drop-shadow-2xl"
            onClick={handleSubmit(onSubmit)}  
        >
          Sign In
        </button>
        {errors.root && (
            <span className="text-xs text-red">{errors.root.message}</span>
        )}
      </form>
    )
  }