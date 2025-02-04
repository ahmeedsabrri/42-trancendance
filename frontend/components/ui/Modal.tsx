import React from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { IMAGES } from "@/public/index";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className={`w-full flex items-center justify-center`}>
      <div className="absolute inset-0 bg-black opacity-70 blur-3xl"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0" onClick={onClose} />
        <div
          className={`relative ${
            title === "Change Password" ? `h-[40%]` : `h-[60%]`
          } p-6 rounded-2xl overflow-hidden w-full max-w-md `}
        >
          <div className="absolute inset-0 z-[-1] bg-gray-400 bg-opacity-40 blur-2xl" />
          <Image
            src={IMAGES.standardBackground}
            alt="modal-bg"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="absolute -z-10 bg-gray-400 bg-opacity-40 blur-2xl"
          />
          <div className="flex items-center justify-center mb-10 relative">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white/50 transition-colors"
            >
              <X
                size={20}
                className="text-white/65 hover:text-white/95 transition-all absolute -top-3 -right-3"
              />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
