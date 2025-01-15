"use client";
import React, { useState, useRef, useEffect } from 'react';
import { CircleChevronDown, CircleChevronUp, X } from 'lucide-react';
import { Link } from 'next/link';
import { useUserStore } from '@/app/store/store';
import { AuthActions } from '@/app/auth/utils';
import { redirect } from 'next/navigation';

export function DropdownPanel ()  {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  const {user} = useUserStore();
  console.log(user);
  const { logout} = AuthActions();
  
      const handleLogout = () => {
          logout()
            .then(() => {
              redirect('/auth');
            })
            .catch(() => {
              console.error("Logout failed");
              });
          };

          useEffect(() => {
            console.log('useEffect: adding click event listener');
            const handleClickOutside = (event) => {
              if (panelRef.current && !panelRef.current.contains(event.target)) {
                setIsOpen(false);
              }
            };
          
            document.addEventListener('click', handleClickOutside);
            return () => {
              document.removeEventListener('click', handleClickOutside);
            };
          }, []);

  return (
    <div className="relative">
      <div
        className="cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <CircleChevronDown className="w-6 h-6 text-white" /> 
        : <CircleChevronUp className="w-6 h-6 text-white" />}
      </div>
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-96 max-h-[32rem] overflow-hidden
          bg-white/10 backdrop-blur-2xl border border-white/20 rounded-lg shadow-xl
          flex flex-col z-50"
        >
          <div className="sticky top-0 flex items-center justify-between p-4 bg-white/5 backdrop-blur-3xl border-b border-white/10">
            <h3 className="text-white font-medium">Menu</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white"
            >
            </button>
          </div>
          <div className="overflow-y-auto divide-y divide-white/10">
            <a
                href={`/profile/${user?.username}`}
                className="block px-4 py-2 text-white hover:bg-gradient-to-r hover:from-hover_color"
            >
              Profile
            </a>
            <a
              href="/dashboard/setting"
              className="block px-4 py-2 text-white hover:bg-gradient-to-r hover:from-hover_color"
            >
              Setting
            </a>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-red hover:text-red hover:bg-gradient-to-r"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};