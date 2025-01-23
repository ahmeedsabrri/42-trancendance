'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import SignUpForm from './components/signup'
import SignInForm from './components/signin'
import Oauthbutton from './components/Oauthbutton'
import {redirect, useSearchParams } from 'next/navigation'
import OTP from './otp/page'
import { AuthActions } from './utils'
import { useRouter } from 'next/router'
import { LuArrowRight } from "react-icons/lu";
import { Bounce, toast } from 'react-toastify'
export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [otpRequired, setOtpRequired] = useState(false);

  const searchParams = useSearchParams();
  const notifToast = (message:string) => toast(message,{
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
  useEffect(() => {
    const otpRequiredParam = searchParams.get('otp_code');
    if (otpRequiredParam === 'requried') {
      setOtpRequired(true);
      console.log('OTP is required');
    }
  }, [searchParams]);
  const {loginWithOtp } = AuthActions();
  const onOtpSubmit = (otp_code: string) => {
    loginWithOtp('', '', otp_code)
    .then((res) => {
      console.log("Logged in successfully");
      notifToast(res.data.message);
      window.location.href = '/';
    })
    .catch((error) => {
      console.log(error);
      notifToast(error.response.data[0]);
    });
  };
  const toggleForm = () => {
    setIsSignUp(!isSignUp)
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-auto md:h-[700px] bg-white/10 rounded-3xl rounded-tl-[8rem] rounded-br-[8rem] overflow-hidden  backdrop-blur-md shadow-2xl flex flex-col md:flex-row">
        <div className="w-full md:w-1/2  flex flex-col justify-between relative">
          <Image
            src="/images/background.jpg?height=700&width=600"
            alt="Ping Pong"
            layout="fill"
            objectFit='cover'
            className="absolute inset-0 z-0 bg-cover bg-no-repeat"
          />
          <div className="relative z-10 flex flex-col items-center justify-center h-full pt-8 backdrop-blur-[5px]">
            
            <div className='w-full absolute top-0 p-4 rounded-full flex justify-end items-center'> 
              {!otpRequired && <button className='p-2 rounded-full  transition ease-in-out delay-150 text-white font-bold border-white/20 border  backdrop-blur-lg shadow-2xl bg-black/20 hover:bg-black/30' onClick={toggleForm}> 
                <LuArrowRight />
              </button>}
            </div>
            <h1 className="text-4xl font-extrabold text-white/80 mb-6 text-center">
              Welcome to Trancendance
            </h1>
            <Oauthbutton/>
          </div>
        </div>
        <div className="w-full md:w-1/2 relative flex justify-center items-center">
          <AnimatePresence mode="wait">
              <motion.div
                key={isSignUp ? 'signup' : 'signin'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 p-8 flex justify-center items-center"
              >
                {/* {isSignUp ? <SignUpForm /> : <SignInForm />} */}
                { otpRequired ?
                <div className='space-y-4 flex flex-col items-center justify-center'>
                  <div className="mt-1 flex justify-center items-center">
                    <h2 className="text-3xl font-bold text-white mb-6">OTP Code Requried</h2>
                  </div>
                  <OTP onSubmit={onOtpSubmit}/>
                  </div> 
                  : isSignUp ? <SignUpForm /> : <SignInForm />}
              </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}





