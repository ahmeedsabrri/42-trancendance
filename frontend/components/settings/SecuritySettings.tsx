"use client";

import React, { useState } from 'react';
import { Shield, Key } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { PasswordChangeForm } from './PasswordChangeForm';
import { useUser } from '@/app/context/userContext';
import { handelTwoFactor } from '@/app/dashboard/setting/action';
import { useEffect } from 'react';
export function SecuritySettings() {
  const { user, loading, error } = useUser();
  const {handleTwoFactorDisable, handleTwoFactorEnable} = handelTwoFactor();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twofa_enabled);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  useEffect(() => {
    setTwoFactorEnabled(user?.twofa_enabled);
    console.log(user?.twofa_enabled);
  }, [user]);
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
              onClick={twoFactorEnabled ? handleTwoFactorDisable : handleTwoFactorEnable}
              className={`px-4 py-2 rounded-lg border-2 transition-all 
              ${(!twoFactorEnabled ? 'bg-red/20 hover:bg-red/40 text-red'
                  : 'bg-green/20 hover:bg-green/40 text-green')}`}
            >
              {!twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
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
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <PasswordChangeForm/>
      </Modal>  
    </>
  );
}