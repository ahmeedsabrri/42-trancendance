
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthActions } from "../utils";
import { useRouter } from "next/navigation";

type FormData = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};
export default function SignUpForm() {
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevState: FormData) => ({
          ...prevState,
          [id]: value,
        }));
    };
    const {
        handleSubmit,
        formState: { errors },
        setError,
      } = useForm<FormData>();
    
      const router = useRouter();
    
      const { register: registerUser } = AuthActions(); // Note: Renamed to avoid naming conflict with useForm's register
    
      const onSubmit = () => {
        registerUser(formData.firstName, formData.lastName, formData.email, formData.username, formData.password)
          .then(() => {
            console.log("Registered successfully");
            alert("Registered successfully");
          })
          .catch((err) => {
            setError("root", { type: "manual", message: err.message });
          });
      };
    return (
      <form className="space-y-7">
        <div className="mt-1 flex justify-center items-center">
          <h2 className="text-3xl font-bold text-white mb-6">Sign Up</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
                type="text"
                id="firstName"
                className="mt-1 block w-full px-3 py-3 placeholder-white placeholder-opacity-50 bg-transparent backdrop-blur-lg rounded-full outline-slate-400 drop-shadow-2xl shadow-2xl"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="text"
              id="lastName"
              className="mt-1 block w-full px-3 py-3 placeholder-white placeholder-opacity-50 bg-transparent backdrop-blur-lg rounded-full outline-slate-400 drop-shadow-2xl shadow-2xl"
              placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <input
            type="text"
            id="username"
            required
            className="mt-1 block w-full px-3 py-3 placeholder-white placeholder-opacity-50 bg-transparent backdrop-blur-lg rounded-full outline-slate-400 drop-shadow-2xl shadow-2xl"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="email"
            id="email"
            required
            className="mt-1 block w-full px-3 py-3 placeholder-white placeholder-opacity-50 bg-transparent backdrop-blur-lg rounded-full outline-slate-400 drop-shadow-2xl shadow-2xl"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            required
            className="mt-1 block w-full px-3 py-3 placeholder-white placeholder-opacity-50 bg-transparent backdrop-blur-lg rounded-full outline-slate-400 drop-shadow-2xl shadow-2xl"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="password"
            id="confirmPassword"
            required
            className="mt-1 block w-full px-3 py-3 placeholder-white placeholder-opacity-50 bg-transparent backdrop-blur-lg rounded-full outline-slate-400 drop-shadow-2xl shadow-2xl"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <div className="mt-1 flex justify-center items-center">
          <button
            type="submit"
            className="transition ease-in-out delay-150 bg-black text-white font-bold bg-transparent backdrop-blur-lg  rounded-full px-3 py-3 mt-1 size-full hover:bg-zinc-900 drop-shadow-2xl shadow-2xl"
            onClick={handleSubmit(onSubmit)}
          >
            Sign Up
          </button>
        </div>
        {errors.root && (
            <span className="text-xs text-red">{errors.root.message}</span>
        )}
      </form>
    )
  }