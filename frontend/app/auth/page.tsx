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

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [otpRequired, setOtpRequired] = useState(false);

  const searchParams = useSearchParams();

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
    .then(() => {
      console.log("Logged in successfully");
      // Redirect on successful login
      window.location.href = '/';
    })
    .catch((error) => {
      console.log(error);
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
            <h1 className="text-4xl font-extrabold text-white/80 mb-6 text-center">
              Welcome to ft_trancendance
            </h1>
              <button
                onClick={toggleForm}
                className="transition ease-in-out delay-150 text-white font-bold border-white/20 shadow-2xl bg-transparent border  backdrop-blur-lg rounded-full p-2 my-2 w-[250px] h-[50px] hover:bg-white/40 "
              >
                {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
              </button>
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





