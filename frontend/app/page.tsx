"use client";
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
    <div className="w-full max-w-6xl h-auto md:h-[700px] rounded-xl overflow-hidden backdrop-blur-lg bg-white bg-opacity-10 shadow-lg flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col justify-center relative">
        <Image
          src="/images/auth-background.png?height=700&width=600"
          alt="Ping Pong Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center md:text-left backdrop-blur-sm bg-white/5 bg-opacity-20 p-8"> 
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Welcome to Ping Pong Central
          </h1>
          <p className="text-xl text-white mb-8">
            Your ultimate destination for all things table tennis. Join our community of ping pong enthusiasts!
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center bg-zinc-700 bg-opacity-20 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-8">Get Started</h2>
        <div className="space-y-4 w-full max-w-md">
          <Link href="/auth" className="block w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105 text-center">
            Login
          </Link>
          <Link href="/auth" className="block w-full py-3 px-4 border border-white rounded-md shadow-sm text-lg font-medium text-white bg-transparent hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition duration-300 ease-in-out transform hover:scale-105 text-center">
            Register
          </Link>
        </div>
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Why Join Us?</h3>
          <ul className="text-white space-y-2">
            <li>Access to exclusive tournaments</li>
            <li>Connect with other ping pong enthusiasts</li>
            <li>Improve your skills with expert tips</li>
            <li>Stay updated with the latest ping pong news</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  );
}
