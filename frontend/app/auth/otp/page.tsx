"use client";

import { useState } from "react";

type OTPProps = {
  onSubmit: (otpCode: string) => void;
};

export default function OTP({ onSubmit }: OTPProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    // Allow only numeric input
    if (element.value && isNaN(parseInt(element.value))) {
      return false;
    }

    // Update the OTP state
    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      newOtp[index] = element.value;
      return newOtp;
    });

    // Move to the next input if a value is entered
    if (element.value && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle Backspace key
    if (e.key === "Backspace") {
      // Update the OTP state to remove the current value
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = "";
        return newOtp;
      });

      // Move focus to the previous input field
      if (e.currentTarget.previousSibling) {
        (e.currentTarget.previousSibling as HTMLInputElement).focus();
      }
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
            onKeyDown={(e) => handleKeyDown(e, index)}
            onChange={(e) => handleChange(e.target as HTMLInputElement, index)}
            className="w-12 h-12 text-center text-2xl bg-white bg-opacity-20 border border-white border-opacity-30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
          />
        ))}
      </div>
      <button
        type="submit"
        className="transition ease-in-out delay-150  text-white font-bold  backdrop-blur-lg  rounded-full px-3 py-3 mt-1 size-full  bg-black/20 hover:bg-black/30 drop-shadow-2xl shadow-2xl"
      >
        Verify OTP
      </button>
    </form>
  );
}