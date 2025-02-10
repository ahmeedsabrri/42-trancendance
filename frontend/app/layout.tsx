"use client";

import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();


import { usePathname } from "next/navigation";

import SideBar from "@/components/sidebar/Sidebar";
import NavBar from "./Games/components/navbar/NavBar";
import { ToastContainer, Bounce } from "react-toastify";
import { Orbitron } from 'next/font/google';
import { useEffect} from "react"; 
import { AuthActions } from "./auth/utils";


// Configure the font
const orbitron = Orbitron({
  subsets: ['latin'], // Specify subsets (e.g., 'latin', 'cyrillic')
  weight: ['400', '700'], // Specify font weights
  display: 'swap', // Reduce layout shift
  variable: '--font-orbitron', // Define a CSS variable for Tailwind
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Define routes where NavBar and SideBar should not be rendered
  const isAuthRoute = pathname === "/auth";
  const isCallbackRoute = pathname?.startsWith("/auth/callback");
  const isVerifyEmailRoute = pathname?.startsWith("/auth/verify-email");
  const isOtpRoute = pathname?.startsWith("/auth/otp");
  const isLandingPage = pathname === "/";
   // Directly compute render condition
  const shouldRenderNavAndSideBar = !(
    isAuthRoute || 
    isCallbackRoute || 
    isVerifyEmailRoute || 
    isOtpRoute || 
    isLandingPage
  );
  const { check_auth } = AuthActions();


  useEffect(() => {
    if (shouldRenderNavAndSideBar) {
      check_auth().catch(() => {
        window.location.href = "/auth";
      });
    }
    // eslint-disable-next-line
  }, [shouldRenderNavAndSideBar]); 
  return (
    <html lang="en" className={`${orbitron.variable}`}>
      <body className={shouldRenderNavAndSideBar ? "w-screen h-screen font-orbitron overflow-hidden flex justify-center items-center bg-background bg-center bg-no-repeat bg-cover bg-black bg-opacity-50 backdrop-blur-3xl" : "bg-background font-orbitron bg-center bg-no-repeat bg-cover bg-black bg-opacity-50 backdrop-blur-3xl"}>
        {shouldRenderNavAndSideBar && (
             <>
             <div className="w-[90%] h-[90%] flex justify-start items-center">
               <QueryClientProvider client={queryClient}>
                 <SideBar />
                 <div className="w-full h-full flex flex-col justify-start items-center gap-10">
                   <NavBar />
                   {children}
                 </div>
               </QueryClientProvider>
             </div>
           </>
        )}
        {!shouldRenderNavAndSideBar && children}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </body>
    </html>
  );
}