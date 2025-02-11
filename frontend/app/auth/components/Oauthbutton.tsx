import React from 'react';
import { useRouter } from 'next/navigation';

export default function Oauthbutton() {
    const router = useRouter();
    const handleOAuthClick = () => {
      const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;
      if (authUrl) 
        router.push(authUrl);
    };
  
    return (
        <button 
          onClick={handleOAuthClick}
          className="transition ease-in-out delay-150 text-white font-bold border border-white/10 shadow-2xl font-serif  backdrop-blur-lg rounded-full p-2 my-2 w-[250px] h-[50px] bg-black/20 hover:bg-black/30"
        >
          42 Intra
        </button> 
    );
  }