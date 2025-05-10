"use client";

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AuthActions } from '@/app/auth/utils';
import { useForm } from "react-hook-form";
import { Bounce, toast } from 'react-toastify';


type FormData = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};
export function PasswordChangeForm() {
  const notify = (message: string) =>
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
  const {changePassword} = AuthActions();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  
  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState: FormData) => ({
      ...prevState,
      [id]: value,
    }));
  };
  const {formState: { errors },setError,} = useForm<FormData>();

  const onSubmit = () => {
    
    if (formData.new_password !== formData.confirm_password) {
      setError("root", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
     changePassword(formData.current_password, formData.new_password, formData.confirm_password)
      .then(() => {
        notify("Password changed successfully");
      })
      .catch((error) => {
        if (error.response.status === 400 && error.response.data?.current_password) {
          setError("root", {
            type: "manual",
            message: "current password is unvalid",
          });
        }
          
       else if (error.response.status === 400 && error.response.data?.new_password){
          setError("root", {
            type: "manual",
            message: "new password is unvalid",
          });
       } 
        else if (error.response.status === 400 && error.response.data?.confirm_password) {
          setError("root", {
            type: "manual",
            message: "confirm password is unvalid",
          });
        }
        else
          setError("root", {
            type: "manual",
            message: "An error occurred",
          });
      });
  };
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.current ? 'text' : 'password'}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
            required
            value={formData.current_password}
            onChange={handleChange}
            id="current_password"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('current')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-white">
          New Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.new ? 'text' : 'password'}
            id='new_password'
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
            required
            value={formData.new_password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('new')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-white">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.confirm ? 'text' : 'password'}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
            required
            value={formData.confirm_password}
            onChange={handleChange}
            id='confirm_password'
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirm')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-lg transition ease-in-out delay-150 bg-black/20 hover:bg-black/30  font-bold  backdrop-blur-lg  text-white "
          onClick={onSubmit}
        >
          Update Password
        </button>
      </div>
      {errors.root && (
        <span className="text-xs text-red-500">{errors.root.message}</span>
      )}
    </form>
  );
}