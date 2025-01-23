"use client";

import { UserData } from '@/app/store/store';
import React, {useState } from 'react';
import { useEffect } from 'react';
import { PasswordChangeForm } from './PasswordChangeForm';
import { Shield, Key} from 'lucide-react';
import QRCode from 'react-qr-code';
import { Modal } from '../ui/Modal';
import { Switch } from '../ui/switch';
import { handelTwoFactor } from '@/app/dashboard/setting/action';


export function SecuritySettings({user}: {user : UserData}) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [openOtpForm, setOpenOtpForm] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isOtpEnabled, setIsOtpEnabled] = useState(user.twofa_enabled);
  const {handleTwoFactorEnable,handleTwoFactorDisable}= handelTwoFactor()
  useEffect(() => {
    console.log(user.twofa_enabled);
    console.log(user.otp_uri);
  }, [user]);
  useEffect(() => {
    console.log(openOtpForm);
    console.log(isOtpEnabled);
    console.log(otpCode);
  }
  , [openOtpForm]);
  const handelOtpCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtpCode(e.target.value);
  }
  const handleOtpEnable = () => {
    try{
    setIsOtpEnabled(!isOtpEnabled);
    }
    catch (error){
      console.log(error);
    }
  }   

  const handleOtpSubmit = () => {
    console.log(isOtpEnabled);
    console.log(otpCode);
    if (isOtpEnabled){
      handleTwoFactorEnable(otpCode);
    }
    else{
      handleTwoFactorDisable(otpCode);
    }
  }
  return (
    <>
      <div className="backdrop-blur-md bg-white/10 rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security Settings
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Two-Factor Authentication</h3>
              <p className="text-gray-300 text-sm">Add an extra layer of security to your account</p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              onClick={() => setOpenOtpForm(true)}
              >
              2fa Enable / Disable
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Password</h3>
              <p className="text-gray-300 text-sm">Change your account password</p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
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
        <div className='flex flex-col items-center justify-center px-5'>
        
        {!user.twofa_enabled && <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "50%", width: "50%" }}
          value={user.otp_uri}
          viewBox={`0 0 256 256`}
        />}
        <div className="flex flex-col items-center justify-between py-4">
          <label className="text-white">  
            {!user.twofa_enabled ? `Switch Enable Two-Factor Authentication` : `Switch Disable Two-Factor Authentication`}
          </label>
          <Switch
            checked={isOtpEnabled}
            onCheckedChange={handleOtpEnable}
          />
        </div>
        <p className="text-white text-center mt-4">
          Scan the QR code above with Google Authenticator or Authy to enable Two-Factor Authentication
        </p>
        <input 
        type="text" 
        name="Otpcode"
        value={otpCode}
        onChange={handelOtpCode}
        placeholder='Enter your Otp Code'
        className='placeholder-white text-white/50 placeholder-opacity-50 bg-transparent backdrop-blur-lg p-2 rounded-full w-[250px] h-[50px] m-2 outline-slate-400 drop-shadow-2xl shadow-2xl'/>
        <button 
          className='transition ease-in-out delay-150 bg-black text-white font-bold bg-transparent backdrop-blur-lg  hover:bg-zinc-900 rounded-full p-2 my-2 w-[250px] h-[50px]  drop-shadow-2xl'
          onClick={handleOtpSubmit}
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
        <PasswordChangeForm/>
      </Modal>  
    </>
  );
}
