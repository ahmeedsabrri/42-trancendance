"use client";

import { useState } from "react";

type OTPProps = {
  onSubmit: (otpCode: string) => void;
};

export default function OTP({onSubmit }: OTPProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(parseInt(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    onSubmit(otpCode);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center justify-center">
      <div className="flex justify-between">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            className="w-12 h-12 text-center text-2xl bg-white bg-opacity-20 border border-white border-opacity-30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
          />
        ))}
      </div>
      <button
        type="submit"
        className="transition ease-in-out delay-150 bg-black text-white font-bold bg-transparent backdrop-blur-lg  hover:bg-zinc-900 rounded-full p-2 my-2 w-[250px] h-[50px]  drop-shadow-2xl"
      >
        Verify OTP
      </button>
    </form>
  );
}