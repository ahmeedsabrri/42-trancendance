import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthActions } from "../utils";
import { useRouter } from "next/navigation";
import OTP from "../otp/OTP";
import { Bounce, toast } from "react-toastify";

type FormData = {
  username: string;
  password: string;
};

export default function SignInForm() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [otpFormOpen, setOtpFormOpen] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();
  const notifToast = (message:string) => toast(message,{
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  });
  const router = useRouter();
  const { login, loginWithOtp } = AuthActions();

  const onSubmit = () => {
    login(formData.username, formData.password)
      .then(() => {
        console.log("Logged in successfully");
          router.push("/"); // Redirect on successful login
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 400) {
        const errorData = error.response.data;
        if (errorData.otp_code) {
          setOtpFormOpen(true);
          notifToast("OTP code required");
        } else {
          // Handle other validation errors
          setError("root", {
            type: "manual",
            message: errorData || "An error occurred",
          });
        }
      } else {
        // console.error(error.response.data);
        setError("root", {
          type: "manual",
          message: error.response.data.detail

        });
      }
      });
  };
  const onOtpSubmit = (otp_code:string) => {
    loginWithOtp(formData.username, formData.password, otp_code)
      .then(() => {
        console.log("Logged in successfully");
        router.push("/"); // Redirect on successful login
        notifToast("Logged in successfully");
      })
      .catch((error) => {
        console.log(error);
        setError("root", {
          type: "manual",
          message: error.response?.data.message || "Invalid OTP code", // Handle other validation errors
        });
        if (error.response && error.response.status === 400) {
          notifToast("Invalid OTP code");
        }
      });
  };

  return (
    <div className="space-y-4 flex flex-col items-center justify-center">
      {otpFormOpen ? (
       <div className='space-y-4 flex flex-col items-center justify-center'>
       <div className="mt-1 flex justify-center items-center">
         <h2 className="text-3xl font-bold text-white mb-6">OTP Code Requried</h2>
       </div>
       <OTP onSubmit={onOtpSubmit}/>
       </div> 
      ) : (
        <>
          <h2 className="text-3xl font-bold text-white mb-6">Sign In</h2>
          <div>
            <input
              type="text"
              name="username"
              className="placeholder-white placeholder-opacity-50 text-center bg-transparent backdrop-blur-lg p-2 rounded-full m-2 outline-slate-400 drop-shadow-2xl shadow-2xl w-[250px] h-[50px]"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              className="placeholder-white placeholder-opacity-50 text-center bg-transparent backdrop-blur-lg p-2 rounded-full w-[250px] h-[50px] m-2 outline-slate-400 drop-shadow-2xl shadow-2xl"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <button
            type="button" // Change to type="button" to prevent form submission
            className="transition ease-in-out delay-150 bg-black/20 hover:bg-black/30 rounded-3xl text-white font-bold  backdrop-blur-lg  p-2 my-2 w-[250px] h-[50px] drop-shadow-2xl"
            onClick={handleSubmit(onSubmit)}
          >
            Sign In
          </button>
        </>
      )}
      {errors.root && (
        <span className="text-xs text-red-500">{errors.root.message}</span>
      )}
    </div>
  );
}