"use client";

import { UserData } from "@/app/store/store";
import React, { useState } from "react";
import { PasswordChangeForm } from "./PasswordChangeForm";
import { Shield, Key } from "lucide-react";
import QRCode from "react-qr-code";
import { Modal } from "../ui/Modal";
import { Switch } from "../ui/switch";
import { handelTwoFactor } from "@/app/dashboard/setting/action";
import { Bounce, toast } from "react-toastify";

export function SecuritySettings({ user }: { user: UserData }) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [openOtpForm, setOpenOtpForm] = useState(false);
  const [isOtpEnabled, setIsOtpEnabled] = useState(user.twofa_enabled);
  const { handleTwoFactorEnable, handleTwoFactorDisable } = handelTwoFactor();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const handleOtpEnable = () => {
    try {
      setIsOtpEnabled(!isOtpEnabled);
    } catch (error) {
      console.log(error);
    }
  };

  const tostNotify = (message: string) =>
    toast(message, {
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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
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
  const handleOtpSubmit = () => {
    console.log(isOtpEnabled);
    const otpCode = otp.join("");
    console.log(otpCode);
    if (isOtpEnabled) {
      handleTwoFactorEnable(otpCode).then((res) => {
        if (res.success) {
          tostNotify("Two-Factor Authentication Enabled successfully");
        } else {
          tostNotify("Invalid OTP code");
        }
      });
    } else {
      handleTwoFactorDisable(otpCode).then((res) => {
        console.log(res);
        if (res.success) {
          tostNotify("Two-Factor Authentication disabled successfully");
        } else {
          tostNotify("Invalid OTP code");
        }
      });
    }
  };
  return (
    <>
      <div className="backdrop-blur-md rounded-lg p-6 space-y-6 ">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security Settings
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">
                Two-Factor Authentication
              </h3>
              <p className="text-gray-300 text-sm">
                Add an extra layer of security to your account
              </p>
            </div>
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-black/20 hover:bg-black/30 w-[20%] text-white transition-all"
              onClick={() => setOpenOtpForm(true)}
            >
              2fa Enable / Disable
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Password</h3>
              <p className="text-gray-300 text-sm">
                Change your account password
              </p>
            </div>
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-black/20 hover:bg-black/30 w-[20%] text-white transition-all"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              <Key className="w-4 h-4" />
              Change Password
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={openOtpForm}
        onClose={() => setOpenOtpForm(false)}
        title="Two Factor Authentication"
      >
        <div className="flex flex-col items-center justify-center gap-y-4">
          {!user.twofa_enabled && (
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "50%", width: "50%" }}
              value={user.otp_uri}
              viewBox={`0 0 256 256`}
              className="rounded-lg border-2 border-white border-opacity-50 p-2"
            />
          )}
          <div className="flex flex-col items-center justify-center gap-y-2 py-4 w-full">
            <label className="text-white w-full text-center">
              {!user.twofa_enabled
                ? `Enable Two-Factor Authentication`
                : `Disable Two-Factor Authentication`}
            </label>
            <Switch checked={isOtpEnabled} onCheckedChange={handleOtpEnable} />
          </div>

          <p className="text-white text-center">
            Scan the QR code above with Google Authenticator or Authy to enable
            Two-Factor Authentication
          </p>
          <div className="flex justify-center items-center gap-x-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={data}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onChange={(e) =>
                  handleChange(e.target as HTMLInputElement, index)
                }
                className="w-12 h-12 text-center text-2xl bg-white bg-opacity-20 border border-white border-opacity-30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
            ))}
          </div>
          <button
            type="submit"
            onClick={handleOtpSubmit}
            className="transition ease-in-out delay-150  text-white font-bold  backdrop-blur-lg  rounded-full px-3 py-3 mt-1 w-[250px] h-[50px]
          bg-black/20 hover:bg-black/30 drop-shadow-2xl shadow-2xl"
          >
            Enter
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <PasswordChangeForm />
      </Modal>
    </>
  );
}
