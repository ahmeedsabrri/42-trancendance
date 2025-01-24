import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className='w-full flex items-center justify-center'>
    <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0" onClick={onClose} />
      <div className="relative backdrop-blur-3xl bg-gradient-to-r from-slate-900/80 to-slate-700/80  p-6 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white/50 transition-colors"
          >
            <X size={20} className='text-white/65 hover:text-white/95 transition-all'/>
          </button>
        </div>
        {children}
      </div>
    </div>
    </div>
  );
}