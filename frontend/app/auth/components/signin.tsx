import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthActions } from "../utils";
import { useRouter } from "next/navigation";
import OTP from "../otp/page";

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
  const [userId, setUserId] = useState<number | null>(null); // Store user ID for OTP verification
  const {
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

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
          // Show OTP input field and store user ID
          setOtpFormOpen(true);
          setUserId(errorData.user_id);
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
    if (!userId) return;
    loginWithOtp(formData.username, formData.password, otp_code)
      .then(() => {
        console.log("Logged in successfully");
          router.push("/"); // Redirect on successful login
      })
      .catch((error) => {
        // console.log(error);
        if (error.response && error.response.status === 400) {
        const errorData = error.response.data;
        if (errorData.otp_code) {
          // Show OTP input field and store user ID
          setOtpFormOpen(true);
          setUserId(errorData.user_id);
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

  return (
    <div className="space-y-4 flex flex-col items-center justify-center">
      {otpFormOpen ? (
        <OTP user_id={userId!} onSubmit={onOtpSubmit} />
      ) : (
        <>
          <h2 className="text-3xl font-bold text-white mb-6">Sign In</h2>
          <div>
            <input
              type="text"
              name="username"
              className="placeholder-white placeholder-opacity-50 bg-transparent backdrop-blur-lg p-2 rounded-full w-[250px] h-[50px] m-2 outline-slate-400 drop-shadow-2xl shadow-2xl"
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
              className="placeholder-white placeholder-opacity-50 bg-transparent backdrop-blur-lg p-2 rounded-full w-[250px] h-[50px] m-2 outline-slate-400 drop-shadow-2xl shadow-2xl"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <button
            type="button" // Change to type="button" to prevent form submission
            className="transition ease-in-out delay-150 bg-black text-white font-bold bg-transparent backdrop-blur-lg hover:bg-zinc-900 rounded-full p-2 my-2 w-[250px] h-[50px] drop-shadow-2xl"
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