"use client";
import "./globals.css";
import { usePathname } from "next/navigation";

import SideBar from "@/components/sidebar/Sidebar";
import NavBar from "./Games/components/navbar/NavBar";
import { ToastContainer, Bounce } from "react-toastify";

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

  // Determine if NavBar and SideBar should be rendered
  const shouldRenderNavAndSideBar = !(isAuthRoute || isCallbackRoute || isVerifyEmailRoute);

  return (
    <html lang="en">
      <body className={shouldRenderNavAndSideBar ? "w-screen h-screen overflow-hidden flex justify-center items-center bg-background bg-center bg-no-repeat bg-cover" : "bg-background bg-center bg-no-repeat bg-cover"}>
        {shouldRenderNavAndSideBar && (
          <>
            <SideBar />
            <div className="p-[10px] w-[90%] h-[90%] flex flex-col justify-start items-center mx-8 gap-10">
              <NavBar />
              {children}
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