import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 flex items-center justify-center p-4">
      <div className={`w-full max-w-md p-8 rounded-2xl 
                    bg-white/10 backdrop-blur-md 
                    border border-white/20 shadow-2xl
                    ${className}`}>
        {children}
      </div>
    </div>
  );
};